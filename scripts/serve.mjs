import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const {basePath} = JSON.parse(await readFile(path.join(root,'build-info.json'),'utf8'));
const port = Number(process.env.PORT || 4321);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.pdf':'application/pdf'};
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (basePath && pathname === '/') {res.writeHead(302,{Location:basePath+'/'}); return res.end();}
    if (basePath && !pathname.startsWith(basePath+'/')) {res.writeHead(404); return res.end('Not found');}
    let file = path.resolve(root,'.'+pathname.slice(basePath.length));
    if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403); return res.end('Forbidden');}
    let info = await stat(file);
    if (info.isDirectory()) { file = path.join(file,'index.html'); info = await stat(file); }
    const type = types[path.extname(file)] || 'application/octet-stream';
    const data = await readFile(file);
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]); const end = Math.min(range[2] ? Number(range[2]) : info.size-1,info.size-1);
      if (start > end) {res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      res.writeHead(206,{'Content-Type':type,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Accept-Ranges':'bytes'});return res.end(req.method === 'HEAD' ? undefined : data.subarray(start,end+1));
    }
    res.writeHead(200,{'Content-Type':type,'Content-Length':info.size,'Accept-Ranges':'bytes','Cache-Control':'no-cache'});res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}
});
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}${basePath}/`));
process.on('SIGINT',()=>server.close(()=>process.exit()));
