'use strict';

const path = require('path');

module.exports = ({ framework }) => {
  const { Application } = require(framework);
  const EggLoader = require(process.cwd() + '/node_modules/egg-core').EggLoader;

  const loader = new EggLoader({
    baseDir: path.join(__dirname, '../test'),
    app: Object.create(Application.prototype),
    logger: console,
  });
  loader.loadPlugin();

  return loader.allPlugins;
};
