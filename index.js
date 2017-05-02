#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');
const getPlugin = require('./lib/plugin');

program
  .version(require('./package.json'))
  .usage('[baseDir]')
  .option('--dest [dest]', 'Directory that the file writing to');

program.parse(process.argv);

// hide loader tips
console.warn = () => {};

const plugins = getPlugin({
  framework: process.cwd(),
});

let baseDir = program.args[0] || process.cwd();
baseDir = path.resolve(baseDir);

let destDir = program.dest || baseDir;
destDir = path.resolve(destDir);

const def = [];
const deps = [];
const single = [];
const depCont = new Map();
for (const name in plugins) {
  let i = depCont.get(name);
  if (i === undefined) {
    i = 0;
  }
  depCont.set(name, i);
  const plugin = plugins[name];
  def.push(`${name} ${plugin.enable ? '' : '[color=gray]'}`);
  if (plugin.dependencies.length || plugin.optionalDependencies.length) {
    let i = depCont.get(name);
    i++;
    depCont.set(name, i);
    for (const n of plugin.dependencies) {
      deps.push(`${name} -> ${n}`);
      let i = depCont.get(n);
      if (i === undefined) {
        i = 0;
      }
      i++;
      depCont.set(n, i);
    }
    for (const n of plugin.optionalDependencies) {
      deps.push(`${name} -> ${n} [style=dotted]`);
      let i = depCont.get(n);
      if (i === undefined) {
        i = 0;
      }
      i++;
      depCont.set(n, i);
    }
  }
}
console.log(depCont)
const group = [];
for (const [ name, count ] of depCont.entries()) {
  if (!group[count]) group[count] = new Set();
  group[count].add(name);
}
console.log(group);

const content = `
@startuml
digraph plugins {
${group.map(s => '{rank=same; ' + [ ...s ].join(' ') + ';}').join('\n')}

${def.join('\n')}
${deps.join('\n')}
}
@enduml
`;

const pumlPath = path.join(destDir, 'plugins.puml');
mkdirp.sync(destDir);
fs.writeFileSync(pumlPath, content);
console.info(`Writed to ${pumlPath}`);
