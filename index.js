#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const program = require('commander');

program
  .version(require('./package.json'))
  .usage('[baseDir]')
  .option('--dest [dest]', 'Directory that the file writing to');

program.parse(process.argv);

// hide loader tips
console.warn = () => {};

let baseDir = program.args[0] || process.cwd();
baseDir = path.resolve(baseDir);

let destDir = program.dest || baseDir;
destDir = path.resolve(destDir);

const AppWorkerLoader = require(baseDir).AppWorkerLoader;
const loader = new AppWorkerLoader({
  baseDir,
  customEgg: baseDir,
  app: {},
  logger: console,
});
loader.loadPlugin();

const single = [];
const deps = [];
const puml = [];
for (const name in loader.allPlugins) {
  const plugin = loader.allPlugins[name];
  if (plugin.dependencies.length || plugin.optionalDependencies.length) {
    deps.push(name);
    for (const n of plugin.dependencies) {
      puml.push(`"${name}" -> "${n}";`);
    }
    for (const n of plugin.optionalDependencies) {
      puml.push(`"${name}" -> "${n}";`);
    }
  } else {
    single.push(name);
    puml.push(`"${name}";`);
  }
}

const content = `
@startuml
digraph world {
  ${puml.join('\n  ')}
}
@enduml
`;

const pumlPath = path.join(destDir, 'plugins.puml');
mkdirp.sync(destDir);
fs.writeFileSync(pumlPath, content);
console.info(`Writed to ${pumlPath}`);
