/**
 * Debug WebSocket client — adapted from portal's debug/ws-client.
 *
 * In dev only, this:
 *   - Forwards `console.log`/`warn`/`error` to ws://localhost:9999.
 *   - Captures unhandled errors and rejections so they can be fetched on demand.
 *   - Optionally records `fetch()` calls when network logging is toggled on.
 *   - Listens for command messages from the server (click, type, eval, dom, …)
 *     and replies with the result.
 *
 * Activate by calling `installDebugWs()` from the dev entry when
 * `import.meta.env.DEV` is true. The whole module is dynamically imported so
 * production bundles never include any of this code.
 */

export function installDebugWs(): void {
  console.log('DEV mode on');
  try {
    const ws = new WebSocket('ws://localhost:9999');
    ws.addEventListener('open', () => {
      console.log('%c[WS] Debug connected', 'color: lime');
    });

    // ── Console forwarder ──
    const _log = console.log;
    const _warn = console.warn;
    const _err = console.error;
    const safeStringify = (a: unknown): string => {
      if (typeof a !== 'object' || a === null) return String(a);
      try {
        return JSON.stringify(a);
      } catch {
        const seen = new WeakSet<object>();
        try {
          return JSON.stringify(a, (_k, v) => {
            if (typeof v === 'object' && v !== null) {
              if (seen.has(v as object)) return '[Circular]';
              seen.add(v as object);
            }
            return v;
          });
        } catch {
          return '[Unserializable]';
        }
      }
    };
    const send = (...args: Array<unknown>) => {
      if (ws.readyState !== 1) return;
      try {
        ws.send(args.map((a) => safeStringify(a)).join(' '));
      } catch { /* never let the debug bridge break user code */ }
    };
    console.log = (...args: Array<unknown>) => { _log(...args); send(...args); };
    console.warn = (...args: Array<unknown>) => { _warn(...args); send(...args); };
    console.error = (...args: Array<unknown>) => { _err(...args); send(...args); };

    // ── Error collector ──
    interface DbgError { message: string; source: string; line: number; col: number; time: string }
    const collectedErrors: Array<DbgError> = [];
    globalThis.addEventListener('error', (error) => {
      collectedErrors.push({ message: error.message, source: error.filename, line: error.lineno, col: error.colno, time: new Date().toISOString() });
    });
    globalThis.addEventListener('unhandledrejection', (error) => {
      collectedErrors.push({ message: String(error.reason), source: 'promise', line: 0, col: 0, time: new Date().toISOString() });
    });

    // ── Network logger ──
    interface NetEntry { method: string; url: string; status: number; duration: number; time: string }
    let netLogEnabled = false;
    const netEntries: Array<NetEntry> = [];
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (...fetchArgs: Parameters<typeof globalThis.fetch>) => {
      if (!netLogEnabled) return origFetch(...fetchArgs);
      const start = performance.now();
      const reqInput = fetchArgs[0];
      let url: string;
      if (typeof reqInput === 'string') {
        url = reqInput;
      } else if (reqInput instanceof URL) {
        url = reqInput.href;
      } else {
        url = (reqInput as Request).url;
      }
      const method = (fetchArgs[1]?.method ?? 'GET').toUpperCase();
      try {
        const resp = await origFetch(...fetchArgs);
        netEntries.push({ method, url, status: resp.status, duration: Math.round(performance.now() - start), time: new Date().toISOString() });
        return resp;
      } catch (error) {
        netEntries.push({ method, url, status: 0, duration: Math.round(performance.now() - start), time: new Date().toISOString() });
        throw error;
      }
    };

    // ── Command handler ──
    const reply = (cmdId: number, data: Record<string, unknown>) => {
      ws.send(JSON.stringify({ __resp: true, id: cmdId, ...data }));
    };

    const safe = (cmdId: number, fn: () => Record<string, unknown> | Promise<Record<string, unknown>>) => {
      try {
        const result = fn();
        if (result instanceof Promise) {
          result.then((r) => reply(cmdId, r)).catch((error) => reply(cmdId, { error: String(error) }));
        } else {
          reply(cmdId, result);
        }
      } catch (error) {
        reply(cmdId, { error: String(error) });
      }
    };

    type CmdHandler = (cmdId: number, parsed: Record<string, unknown>) => void;
    const cmdHandlers: Record<string, CmdHandler> = {
      refresh(cmdId) { reply(cmdId, {}); location.reload(); },
      'hard-refresh'(cmdId) { reply(cmdId, {}); location.reload(); },
      navigate(cmdId, parsed) { location.href = parsed.url as string; reply(cmdId, {}); },
      back(cmdId) { history.back(); reply(cmdId, {}); },
      forward(cmdId) { history.forward(); reply(cmdId, {}); },

      eval(cmdId, parsed) {
        safe(cmdId, () => {
          // eslint-disable-next-line no-new-func -- debug tool: eval is intentional for remote browser inspection
          const result = new Function(`return (${parsed.code as string})`)();
          return { result: typeof result === 'object' ? JSON.stringify(result, undefined, 2) : String(result ?? 'undefined') };
        });
      },

      dom(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string);
          return el ? { html: el.outerHTML.slice(0, 50_000) } : { error: `No element: ${parsed.selector}` };
        });
      },

      'dom-text'(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string);
          return el ? { text: (el.textContent ?? '').slice(0, 50_000) } : { error: `No element: ${parsed.selector}` };
        });
      },

      click(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string) as HTMLElement | null;
          if (!el) return { error: `No element: ${parsed.selector}` };
          el.click();
          return {};
        });
      },

      type(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string) as HTMLInputElement | null;
          if (!el) return { error: `No element: ${parsed.selector}` };
          el.focus();
          el.value = parsed.text as string;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return {};
        });
      },

      select(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string) as HTMLSelectElement | null;
          if (!el) return { error: `No element: ${parsed.selector}` };
          el.value = parsed.value as string;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return {};
        });
      },

      screenshot(cmdId) {
        reply(cmdId, { error: 'Screenshot requires html2canvas. Install it with: npm i -D html2canvas' });
      },

      netlog(cmdId, parsed) {
        safe(cmdId, () => {
          const mode = parsed.mode as string;
          if (mode === 'on') { netLogEnabled = true; netEntries.length = 0; return {}; }
          if (mode === 'off') { netLogEnabled = false; return {}; }
          return { entries: [...netEntries] };
        });
      },

      storage(cmdId, parsed) {
        safe(cmdId, () => {
          const store = parsed.type === 'session' ? sessionStorage : localStorage;
          const data: Record<string, string> = {};
          for (let i = 0; i < store.length; i++) {
            const key = store.key(i);
            if (key) data[key] = store.getItem(key) ?? '';
          }
          return { data };
        });
      },

      cookies(cmdId) { reply(cmdId, { data: document.cookie }); },
      url(cmdId) { reply(cmdId, { url: location.href, title: document.title }); },

      viewport(cmdId) {
        reply(cmdId, {
          data: {
            width: globalThis.innerWidth, height: globalThis.innerHeight,
            scrollX: globalThis.scrollX, scrollY: globalThis.scrollY,
            docWidth: document.documentElement.scrollWidth,
            docHeight: document.documentElement.scrollHeight,
            devicePixelRatio: globalThis.devicePixelRatio,
          },
        });
      },

      perf(cmdId) {
        safe(cmdId, () => {
          const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (!nav) return { data: 'No navigation entry' };
          return {
            data: {
              dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
              tcp: Math.round(nav.connectEnd - nav.connectStart),
              ttfb: Math.round(nav.responseStart - nav.requestStart),
              download: Math.round(nav.responseEnd - nav.responseStart),
              domParse: Math.round(nav.domInteractive - nav.responseEnd),
              domReady: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
              load: Math.round(nav.loadEventEnd - nav.startTime),
              transferSize: nav.transferSize,
              resourceCount: performance.getEntriesByType('resource').length,
            },
          };
        });
      },

      errors(cmdId) {
        safe(cmdId, () => {
          const errors = [...collectedErrors];
          collectedErrors.length = 0;
          return { data: errors.length > 0 ? errors : 'No errors collected' };
        });
      },

      elements(cmdId, parsed) {
        safe(cmdId, () => {
          const els = document.querySelectorAll(parsed.selector as string);
          const summary = [...els].slice(0, 20).map((el, i) => {
            const tag = el.tagName.toLowerCase();
            const elId = el.id ? `#${el.id}` : '';
            const cls = el.className && typeof el.className === 'string' ? `.${el.className.split(' ').join('.')}` : '';
            const text = (el.textContent ?? '').trim().slice(0, 60);
            return `[${i}] <${tag}${elId}${cls}> ${text}`;
          });
          return { data: { count: els.length, elements: summary } };
        });
      },

      attrs(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string);
          if (!el) return { error: `No element: ${parsed.selector}` };
          const attrs: Record<string, string> = {};
          for (const attr of el.attributes) attrs[attr.name] = attr.value;
          return { data: attrs };
        });
      },

      styles(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string);
          if (!el) return { error: `No element: ${parsed.selector}` };
          const computed = getComputedStyle(el);
          const styleProps = (parsed.props as Array<string>) ?? [];
          if (styleProps.length > 0) {
            const data: Record<string, string> = {};
            for (const p of styleProps) data[p] = computed.getPropertyValue(p);
            return { data };
          }
          const common = ['display', 'visibility', 'opacity', 'position', 'width', 'height',
            'margin', 'padding', 'color', 'background-color', 'font-size', 'z-index', 'overflow'];
          const data: Record<string, string> = {};
          for (const p of common) data[p] = computed.getPropertyValue(p);
          return { data };
        });
      },

      scroll(cmdId, parsed) {
        safe(cmdId, () => {
          const target = parsed.target as string;
          if (target === 'top') { globalThis.scrollTo(0, 0); return {}; }
          if (target === 'bottom') { globalThis.scrollTo(0, document.body.scrollHeight); return {}; }
          const el = document.querySelector(target);
          if (!el) return { error: `No element: ${target}` };
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return {};
        });
      },

      focus(cmdId, parsed) {
        safe(cmdId, () => {
          const el = document.querySelector(parsed.selector as string) as HTMLElement | null;
          if (!el) return { error: `No element: ${parsed.selector}` };
          el.focus();
          return {};
        });
      },

      highlight(cmdId, parsed) {
        safe(cmdId, () => {
          const els = document.querySelectorAll(parsed.selector as string);
          for (const el of els) {
            (el as HTMLElement).style.outline = '3px solid red';
            (el as HTMLElement).dataset.dbgHighlight = '1';
          }
          return { count: els.length };
        });
      },

      unhighlight(cmdId) {
        safe(cmdId, () => {
          for (const el of document.querySelectorAll('[data-dbg-highlight]')) {
            (el as HTMLElement).style.outline = '';
            delete (el as HTMLElement).dataset.dbgHighlight;
          }
          return {};
        });
      },

      // ── PDF form-specific commands ──

      fields(cmdId) {
        safe(cmdId, () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const extract = (globalThis as any).__extractFieldData;
          if (typeof extract === 'function') {
            return { data: extract() };
          }
          return { error: 'window.__extractFieldData not available' };
        });
      },

      'form-data'(cmdId) {
        safe(cmdId, () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return { data: (globalThis as any).__formData ?? null };
        });
      },

      ready(cmdId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reply(cmdId, { ready: !!(globalThis as any).__ready });
      },

      fetch(cmdId, parsed) {
        safe(cmdId, async () => {
          const resp = await origFetch(parsed.url as string, parsed.opts as RequestInit);
          const contentType = resp.headers.get('content-type') ?? '';
          const body = contentType.includes('json') ? await resp.json() : await resp.text();
          return { data: { status: resp.status, headers: Object.fromEntries(resp.headers.entries()), body } };
        });
      },

      headers(cmdId) {
        safe(cmdId, () => {
          const entries = performance.getEntriesByType('resource') as Array<PerformanceResourceTiming>;
          const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return {
            data: {
              serverTiming: nav?.serverTiming?.map((t) => ({ name: t.name, duration: t.duration, description: t.description })) ?? [],
              transferSize: nav?.transferSize,
              protocol: nav?.nextHopProtocol,
              resourceCount: entries.length,
            },
          };
        });
      },
    };

    ws.addEventListener('message', (event) => {
      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(event.data as string); } catch { return; }
      if (!parsed.__cmd) return;

      const cmdId = parsed.id as number;
      const cmd = parsed.cmd as string;
      const handler = cmdHandlers[cmd];
      if (handler) {
        handler(cmdId, parsed);
      } else {
        reply(cmdId, { error: `Unknown command: ${cmd}` });
      }
    });
  } catch {
    // WS server not running, ignore
  }
}
