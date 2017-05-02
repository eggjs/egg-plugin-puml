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
for (const name in plugins) {
  const plugin = plugins[name];
  def.push(`${name} ${plugin.enable ? '' : '[color=gray]'}`);
  if (plugin.dependencies.length || plugin.optionalDependencies.length) {
    for (const n of plugin.dependencies) {
      deps.push(`${name} -> ${n}`);
    }
    for (const n of plugin.optionalDependencies) {
      deps.push(`${name} -> ${n} [style=dotted]`);
    }
  }
}

const content = `
@startuml
digraph plugins {
${def.join('\n')}
${deps.join('\n')}
}
@enduml
`;

const pumlPath = path.join(destDir, 'plugins.puml');
mkdirp.sync(destDir);
fs.writeFileSync(pumlPath, content);
console.info(`Writed to ${pumlPath}`);
