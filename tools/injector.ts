/// <reference types="parse5"/>
/// <reference types="node"/>
import * as parse5 from 'parse5';
const treeAdapter: parse5.TreeAdapter = require('parse5/lib/tree-adapters/default');
import * as fs from 'fs';
import * as path from 'path';

function findElementByName(d: parse5.Element, name: string): parse5.Element {
  if (treeAdapter.isTextNode(d)) return undefined;
  if ((d as parse5.DefaultTreeElement).tagName && (d as parse5.DefaultTreeElement).tagName.toLowerCase() === name) {
    return d;
  }
  if (!treeAdapter.getChildNodes(d)) { return undefined; }
  for (let i=0; i<treeAdapter.getChildNodes(d).length; i++) {
    const f = treeAdapter.getChildNodes(d)[i];
    const result = findElementByName(f, name);
    if (result) return result;
  }
  return undefined;
}

function main(args: string[]) {
  const params = fs.readFileSync(args[0], {encoding: 'utf-8'}).split('\n').filter(l => !!l);
  const output_file = params.shift();
  const input_file = params.shift();

  const document: parse5.DefaultTreeDocument = parse5.parse(fs.readFileSync(input_file, {encoding: 'utf-8'}), {treeAdapter}) as parse5.DefaultTreeDocument;
  const body = findElementByName(document, 'body');

  for (const s of params.filter(s => /\.js$/.test(s))) {
    const script = treeAdapter.createElement('script', undefined, [
      {name: 'type', value: 'text/javascript'},
      {name: 'src', value: `/${path.basename(s)}`},
    ]);
    treeAdapter.appendChild(body, script);
  }


  const content = parse5.serialize(document, {treeAdapter});
  fs.writeFileSync(output_file, content, {encoding: 'utf-8'});
  return 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
