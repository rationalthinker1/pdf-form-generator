/* eslint-env node */
/**
 * Debug WebSocket Server — Remote Browser DevTools for pdf-form-generator
 *
 * A diagnostic bridge between Claude Code (CLI) and the browser dev preview.
 * Receives console logs, and sends commands to the browser for execution.
 *
 * Usage:
 *   node src/devtools/ws-server.mjs          # start server
 *   node src/devtools/ws-server.mjs --help   # show all commands
 *
 * Interactive CLI commands (type while server is running):
 *   refresh                     — reload the page
 *   hard-refresh                — reload with cache clear
 *   go <url>                    — navigate to URL
 *   back / forward              — browser history navigation
 *   eval <js>                   — execute JS in browser and get result
 *   dom <selector>              — get outerHTML of element
 *   dom-text <selector>         — get textContent of element
 *   click <selector>            — click an element
 *   type <selector> <text>      — type text into an input
 *   select <selector> <value>   — set value on a select element
 *   screenshot                  — capture viewport as base64 PNG (saved to src/devtools/)
 *   netlog [on|off|dump]        — toggle network request logging
 *   storage [local|session]     — dump localStorage or sessionStorage
 *   cookies                     — dump document.cookie
 *   url                         — get current page URL + title
 *   viewport                    — get viewport dimensions + scroll position
 *   perf                        — get performance timing metrics
 *   errors                      — get collected JS errors since last check
 *   elements <selector>         — count matching elements + summary
 *   attrs <selector>            — get all attributes of element
 *   styles <sel> [...props]     — get computed styles of element
 *   scroll <sel|top|bottom>     — scroll to target
 *   focus <selector>            — focus an element
 *   highlight <selector>        — red outline on matching elements
 *   unhighlight                 — remove all debug highlights
 *   fields                      — extract PDF form field data (calls __extractFieldData)
 *   form-data                   — dump current __formData
 *   ready                       — check if React has mounted (__ready)
 *   fetch <url> [opts-json]     — make fetch request from browser context
 *   headers                     — page response headers (via performance API)
 *   clear                       — clear the log file
 *   status                      — show connected clients
 *   help                        — show this help
 *
 * The browser connects automatically in dev mode (ws-client.ts).
 * Logs are written to src/devtools/browser.log and stdout.
 */

import { WebSocketServer } from 'ws';
import { writeFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 9999;
const LOG_FILE = path.resolve(__dirname, 'browser.log');

// Clear log file on start
writeFileSync(LOG_FILE, '');

const wss = new WebSocketServer({ port: PORT });
const clients = new Set();
const pendingCallbacks = new Map(); // id -> { resolve, timer }
let cmdId = 0;

// ── Logging ──────────────────────────────────────────────────────────

const log = (message) => {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  appendFileSync(LOG_FILE, entry);
  process.stdout.write(entry);
};

const logResult = (label, data) => {
  const separator = '─'.repeat(60);
  const entry = `\n${separator}\n[${label}]\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}\n${separator}\n`;
  appendFileSync(LOG_FILE, entry);
  process.stdout.write(entry);
};

// ── Command Execution ────────────────────────────────────────────────

function sendCommand(cmd, payload = {}, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const id = ++cmdId;
    const msg = JSON.stringify({ __cmd: true, id, cmd, ...payload });

    let sent = 0;
    for (const ws of clients) {
      if (ws.readyState === 1) {
        ws.send(msg);
        sent++;
      }
    }

    if (sent === 0) {
      reject(new Error('No browser connected'));
      return;
    }

    const timer = setTimeout(() => {
      pendingCallbacks.delete(id);
      reject(new Error('Command timed out'));
    }, timeout);

    pendingCallbacks.set(id, { resolve, timer });
  });
}

function handleResponse(data) {
  try {
    const msg = JSON.parse(data);
    if (msg.__resp && pendingCallbacks.has(msg.id)) {
      const { resolve, timer } = pendingCallbacks.get(msg.id);
      clearTimeout(timer);
      pendingCallbacks.delete(msg.id);
      resolve(msg);
      return true;
    }
  } catch { /* not JSON, treat as log */ }
  return false;
}

// ── CLI Command Handlers ─────────────────────────────────────────────

const commands = {
  async refresh() {
    await sendCommand('refresh');
    log('↻ Page refreshed');
  },

  async 'hard-refresh'() {
    await sendCommand('hard-refresh');
    log('↻ Page hard-refreshed (cache cleared)');
  },

  async go(args) {
    const url = args.trim();
    if (!url) { log('Usage: go <url>'); return; }
    await sendCommand('navigate', { url });
    log(`→ Navigated to: ${url}`);
  },

  async back() {
    await sendCommand('back');
    log('← Back');
  },

  async forward() {
    await sendCommand('forward');
    log('→ Forward');
  },

  async eval(args) {
    const result = await sendCommand('eval', { code: args }, 30000);
    logResult('eval result', result.error || result.result);
  },

  async dom(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: dom <selector>'); return; }
    const result = await sendCommand('dom', { selector });
    logResult(`dom: ${selector}`, result.error || result.html);
  },

  async 'dom-text'(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: dom-text <selector>'); return; }
    const result = await sendCommand('dom-text', { selector });
    logResult(`dom-text: ${selector}`, result.error || result.text);
  },

  async click(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: click <selector>'); return; }
    const result = await sendCommand('click', { selector });
    logResult('click', result.error || `Clicked: ${selector}`);
  },

  async type(args) {
    const match = args.match(/^(\S+)\s+(.+)$/);
    if (!match) { log('Usage: type <selector> <text>'); return; }
    const result = await sendCommand('type', { selector: match[1], text: match[2] });
    logResult('type', result.error || `Typed into: ${match[1]}`);
  },

  async select(args) {
    const match = args.match(/^(\S+)\s+(.+)$/);
    if (!match) { log('Usage: select <selector> <value>'); return; }
    const result = await sendCommand('select', { selector: match[1], value: match[2] });
    logResult('select', result.error || `Selected: ${match[2]} in ${match[1]}`);
  },

  async netlog(args) {
    const mode = args.trim() || 'dump';
    const result = await sendCommand('netlog', { mode });
    if (mode === 'dump' || !mode) {
      logResult('network log', result.error || result.entries);
    } else {
      logResult('netlog', result.error || `Network logging: ${mode}`);
    }
  },

  async storage(args) {
    const type = args.trim() || 'local';
    const result = await sendCommand('storage', { type });
    logResult(`${type}Storage`, result.error || result.data);
  },

  async cookies() {
    const result = await sendCommand('cookies');
    logResult('cookies', result.error || result.data);
  },

  async url() {
    const result = await sendCommand('url');
    logResult('url', result.error || `${result.title}\n${result.url}`);
  },

  async viewport() {
    const result = await sendCommand('viewport');
    logResult('viewport', result.error || result.data);
  },

  async perf() {
    const result = await sendCommand('perf');
    logResult('performance', result.error || result.data);
  },

  async errors() {
    const result = await sendCommand('errors');
    logResult('JS errors', result.error || result.data);
  },

  async elements(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: elements <selector>'); return; }
    const result = await sendCommand('elements', { selector });
    logResult(`elements: ${selector}`, result.error || result.data);
  },

  async attrs(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: attrs <selector>'); return; }
    const result = await sendCommand('attrs', { selector });
    logResult(`attrs: ${selector}`, result.error || result.data);
  },

  async styles(args) {
    const parts = args.trim().split(/\s+/);
    const selector = parts[0];
    const props = parts.slice(1);
    if (!selector) { log('Usage: styles <selector> [...props]'); return; }
    const result = await sendCommand('styles', { selector, props });
    logResult(`styles: ${selector}`, result.error || result.data);
  },

  async scroll(args) {
    const target = args.trim();
    if (!target) { log('Usage: scroll <selector|top|bottom>'); return; }
    const result = await sendCommand('scroll', { target });
    logResult('scroll', result.error || `Scrolled to: ${target}`);
  },

  async focus(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: focus <selector>'); return; }
    const result = await sendCommand('focus', { selector });
    logResult('focus', result.error || `Focused: ${selector}`);
  },

  async screenshot() {
    const result = await sendCommand('screenshot', {}, 15000);
    if (result.error) { logResult('screenshot', result.error); return; }
    const filename = `screenshot-${Date.now()}.png`;
    const filepath = path.resolve(__dirname, filename);
    writeFileSync(filepath, Buffer.from(result.data, 'base64'));
    logResult('screenshot', `Saved to: ${filepath}`);
  },

  async highlight(args) {
    const selector = args.trim();
    if (!selector) { log('Usage: highlight <selector>'); return; }
    const result = await sendCommand('highlight', { selector });
    logResult('highlight', result.error || `Highlighted ${result.count} elements`);
  },

  async unhighlight() {
    await sendCommand('unhighlight');
    log('Removed all highlights');
  },

  // ── PDF form-specific commands ──

  async fields() {
    const result = await sendCommand('fields');
    logResult('fields', result.error || result.data);
  },

  async 'form-data'() {
    const result = await sendCommand('form-data');
    logResult('form-data', result.error || result.data);
  },

  async ready() {
    const result = await sendCommand('ready');
    logResult('ready', `__ready = ${result.ready}`);
  },

  async fetch(args) {
    const match = args.match(/^(\S+)(?:\s+(.+))?$/);
    if (!match) { log('Usage: fetch <url> [options-json]'); return; }
    const opts = match[2] ? JSON.parse(match[2]) : {};
    const result = await sendCommand('fetch', { url: match[1], opts }, 30000);
    logResult(`fetch: ${match[1]}`, result.error || result.data);
  },

  async headers() {
    const result = await sendCommand('headers');
    logResult('headers', result.error || result.data);
  },

  clear() {
    writeFileSync(LOG_FILE, '');
    log('Log cleared');
  },

  status() {
    const count = [...clients].filter(ws => ws.readyState === 1).length;
    log(`Connected clients: ${count}`);
  },

  help() {
    const helpText = `
Commands:
  refresh                     Reload the page
  hard-refresh                Reload with cache bust
  go <url>                    Navigate to URL
  back / forward              Browser history navigation
  eval <js>                   Execute JS in browser context
  dom <selector>              Get outerHTML of element
  dom-text <selector>         Get textContent of element
  click <selector>            Click an element
  type <selector> <text>      Type text into an input
  select <selector> <value>   Set value on select element
  screenshot                  Capture viewport PNG → src/devtools/
  netlog [on|off|dump]        Network request logging
  storage [local|session]     Dump web storage
  cookies                     Dump cookies
  url                         Current URL + title
  viewport                    Viewport size + scroll position
  perf                        Performance timing metrics
  errors                      Collected JS errors
  elements <selector>         Count + summarize matching elements
  attrs <selector>            Get all attributes of element
  styles <sel> [...props]     Get computed styles
  scroll <sel|top|bottom>     Scroll to target
  focus <selector>            Focus an element
  highlight <selector>        Red outline on matching elements
  unhighlight                 Remove debug highlights
  fields                      Extract PDF form field data
  form-data                   Dump current __formData
  ready                       Check if React has mounted
  fetch <url> [opts-json]     Make fetch from browser
  headers                     Page response headers
  clear                       Clear log file
  status                      Show connected clients
  help                        This help text
`;
    process.stdout.write(helpText);
  },
};

// ── WebSocket Server ─────────────────────────────────────────────────

wss.on('connection', (ws) => {
  clients.add(ws);
  log(`Browser connected (${clients.size} total)`);

  ws.on('message', (data) => {
    const str = data.toString();
    if (!handleResponse(str)) {
      log(str);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    log(`Browser disconnected (${clients.size} remaining)`);
  });

  ws.on('error', (err) => {
    log(`WS error: ${err.message}`);
  });
});

// ── Interactive CLI ──────────────────────────────────────────────────

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'dbg> ',
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) { rl.prompt(); return; }

  const spaceIdx = trimmed.indexOf(' ');
  const cmd = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const args = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1);

  if (commands[cmd]) {
    try {
      await commands[cmd](args);
    } catch (err) {
      log(`Error: ${err.message}`);
    }
  } else {
    // Default: treat entire line as eval
    try {
      await commands.eval(trimmed);
    } catch (err) {
      log(`Error: ${err.message}`);
    }
  }

  rl.prompt();
});

// ── Programmatic API (for Claude Code via file) ──────────────────────
// Write a command to src/devtools/cmd.txt and it will be executed automatically

import { watch, existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const CMD_FILE = path.resolve(__dirname, 'cmd.txt');
const RESULT_FILE = path.resolve(__dirname, 'cmd-result.txt');

if (!existsSync(CMD_FILE)) writeFileSync(CMD_FILE, '');

watch(CMD_FILE, async () => {
  try {
    const content = (await readFile(CMD_FILE, 'utf8')).trim();
    if (!content) return;
    await writeFile(CMD_FILE, '');

    const spaceIdx = content.indexOf(' ');
    const cmd = spaceIdx === -1 ? content : content.slice(0, spaceIdx);
    const args = spaceIdx === -1 ? '' : content.slice(spaceIdx + 1);

    if (commands[cmd]) {
      try {
        const result = await executeAndCapture(cmd, args);
        await writeFile(RESULT_FILE, result);
      } catch (err) {
        await writeFile(RESULT_FILE, `Error: ${err.message}`);
      }
    } else {
      try {
        const result = await executeAndCapture('eval', content);
        await writeFile(RESULT_FILE, result);
      } catch (err) {
        await writeFile(RESULT_FILE, `Error: ${err.message}`);
      }
    }
  } catch { /* ignore fs race conditions */ }
});

async function executeAndCapture(cmd, args) {
  const simpleCommands = ['refresh', 'hard-refresh', 'back', 'forward', 'clear', 'unhighlight'];
  if (simpleCommands.includes(cmd)) {
    await commands[cmd](args);
    return 'OK';
  }
  if (cmd === 'status') {
    const count = [...clients].filter(ws => ws.readyState === 1).length;
    return `Connected clients: ${count}`;
  }
  if (cmd === 'help') {
    commands.help();
    return 'OK';
  }

  try {
    const result = await sendCommandForCapture(cmd, args);
    return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function sendCommandForCapture(cmd, args) {
  switch (cmd) {
    case 'eval':
      return (await sendCommand('eval', { code: args }, 30000)).result;
    case 'dom':
      return (await sendCommand('dom', { selector: args.trim() })).html;
    case 'dom-text':
      return (await sendCommand('dom-text', { selector: args.trim() })).text;
    case 'click':
      await sendCommand('click', { selector: args.trim() });
      return `Clicked: ${args.trim()}`;
    case 'type': {
      const m = args.match(/^(\S+)\s+(.+)$/);
      if (!m) return 'Usage: type <selector> <text>';
      await sendCommand('type', { selector: m[1], text: m[2] });
      return `Typed into: ${m[1]}`;
    }
    case 'select': {
      const m = args.match(/^(\S+)\s+(.+)$/);
      if (!m) return 'Usage: select <selector> <value>';
      await sendCommand('select', { selector: m[1], value: m[2] });
      return `Selected ${m[2]} in ${m[1]}`;
    }
    case 'focus':
      await sendCommand('focus', { selector: args.trim() });
      return `Focused: ${args.trim()}`;
    case 'scroll':
      await sendCommand('scroll', { target: args.trim() });
      return `Scrolled to: ${args.trim()}`;
    case 'highlight': {
      const r = await sendCommand('highlight', { selector: args.trim() });
      return `Highlighted ${r.count} elements`;
    }
    case 'netlog': {
      const mode = args.trim() || 'dump';
      const r = await sendCommand('netlog', { mode });
      return mode === 'dump' ? JSON.stringify(r.entries, null, 2) : `Network logging: ${mode}`;
    }
    case 'styles': {
      const parts = args.trim().split(/\s+/);
      const r = await sendCommand('styles', { selector: parts[0], props: parts.slice(1) });
      return r.data;
    }
    case 'url': {
      const u = await sendCommand('url');
      return `${u.title}\n${u.url}`;
    }
    case 'viewport':
      return (await sendCommand('viewport')).data;
    case 'perf':
      return (await sendCommand('perf')).data;
    case 'errors':
      return (await sendCommand('errors')).data;
    case 'storage':
      return (await sendCommand('storage', { type: args.trim() || 'local' })).data;
    case 'cookies':
      return (await sendCommand('cookies')).data;
    case 'elements':
      return (await sendCommand('elements', { selector: args.trim() })).data;
    case 'attrs':
      return (await sendCommand('attrs', { selector: args.trim() })).data;
    case 'go':
      await sendCommand('navigate', { url: args.trim() });
      return `Navigated to: ${args.trim()}`;
    case 'headers':
      return (await sendCommand('headers')).data;
    case 'fetch': {
      const match = args.match(/^(\S+)(?:\s+(.+))?$/);
      const opts = match[2] ? JSON.parse(match[2]) : {};
      return (await sendCommand('fetch', { url: match[1], opts }, 30000)).data;
    }
    case 'screenshot': {
      const result = await sendCommand('screenshot', {}, 15000);
      if (result.error) return result.error;
      const filename = `screenshot-${Date.now()}.png`;
      const filepath = path.resolve(__dirname, filename);
      writeFileSync(filepath, Buffer.from(result.data, 'base64'));
      return `Saved: ${filepath}`;
    }
    case 'fields':
      return (await sendCommand('fields')).data;
    case 'form-data':
      return (await sendCommand('form-data')).data;
    case 'ready': {
      const r = await sendCommand('ready');
      return `__ready = ${r.ready}`;
    }
    default:
      return (await sendCommand('eval', { code: `${cmd} ${args}` }, 30000)).result;
  }
}

// ── Startup ──────────────────────────────────────────────────────────

console.log(`\nDebug WS server listening on ws://localhost:${PORT}`);
console.log(`Logs: ${LOG_FILE}`);
console.log(`File API: write commands to ${CMD_FILE}, read results from ${RESULT_FILE}`);
console.log(`Type 'help' for available commands.\n`);

if (process.argv.includes('--help')) {
  commands.help();
}

rl.prompt();
