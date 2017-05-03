'use strict';

module.exports = ({ framework, baseDir }) => {
  const { Application } = require(framework);
  const EggLoader = require('egg-core').EggLoader;

  const loader = new EggLoader({
    baseDir,
    logger: console,
    app: Object.create(Application.prototype),
  });
  loader.loadPlugin();

  return loader.allPlugins;
};
