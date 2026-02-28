import { createServer } from 'vite';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const tmpDir = resolve(tmpdir(), 'vite-test-' + randomBytes(4).toString('hex'));
mkdirSync(tmpDir, { recursive: true });
writeFileSync(resolve(tmpDir, 'index.html'), '<html><body>hello</body></html>');

const server = await createServer({
  root: tmpDir,
  server: { port: 5173, host: '127.0.0.1' },
  logLevel: 'info',
});
await server.listen();
console.log('listening:', JSON.stringify(server.httpServer?.address()));
await new Promise(r => setTimeout(r, 6000));
await server.close();
console.log('closed');
