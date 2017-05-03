'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const assert = require('assert');
const getPlugin = require('./lib/plugin');

const defaults = {
  baseDir: process.cwd(),
  framework: '',
  dest: '',
};

module.exports = options => {
  options = Object.assign({}, defaults, options);
  assert(options.framework);

  const baseDir = path.resolve(options.baseDir);
  const framework = path.resolve(options.framework);

  let dest = options.dest || baseDir;
  dest = path.resolve(dest);

  const plugins = getPlugin({
    baseDir,
    framework,
  });

  const def = [];
  const deps = [];
  for (const name in plugins) {
    const plugin = plugins[name];
    def.push(`${name}${plugin.enable ? '' : ' [color=gray]'}`);
    if (plugin.dependencies.length || plugin.optionalDependencies.length) {
      for (const n of plugin.dependencies) {
        deps.push(`${name} -> ${n}`);
      }
      for (const n of plugin.optionalDependencies) {
        deps.push(`${name} -> ${n} [style=dotted]`);
      }
    }
  }

  let content = '';
  content += '@startuml\n';
  content += 'digraph plugins {\n';
  content += def.map(d => '  ' + d).join('\n') + '\n';
  content += deps.map(d => '  ' + d).join('\n') + '\n';
  content += '}\n';
  content += '@enduml\n';

  const pumlPath = path.join(dest, 'plugins.puml');
  mkdirp.sync(dest);
  fs.writeFileSync(pumlPath, content);
  console.info(`Writed to ${pumlPath}`);
};
