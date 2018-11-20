/// <reference types="node"/>
import * as fs from 'fs';
import * as path from 'path';



function main(args: string[]) {
  const params = fs.readFileSync(args[0], {encoding: 'utf-8'}).split('\n').filter(l => !!l);

  const outdir = params.shift();
  if (!fs.existsSync(outdir)) fs.mkdirSync(outdir);

  for (const f of params) {
    if (fs.statSync(f).isDirectory()) {
      const foutDir = path.join(outdir, path.basename(f));
      fs.mkdirSync(foutDir);
      for (const file of fs.readdirSync(f)) {
        const content = fs.readFileSync(path.join(f, file), {encoding: 'utf-8'});
        fs.writeFileSync(path.join(foutDir, path.basename(file)), content, {encoding: 'utf-8'});
      }
    } else {

      const content = fs.readFileSync(f, {encoding: 'utf-8'});
      fs.writeFileSync(path.join(outdir, path.basename(f)), content, {encoding: 'utf-8'});
    }
  }
  return 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}