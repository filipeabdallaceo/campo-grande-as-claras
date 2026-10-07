import { cp, rm, mkdir } from 'node:fs/promises';
await rm('site',{recursive:true,force:true});
await mkdir('site',{recursive:true});
await cp('dist','site',{recursive:true});
console.log('Pacote estático atualizado em site/. DigitalOcean publica sem servidor ou banco.');
