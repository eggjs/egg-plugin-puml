'use strict';

const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

module.exports = ({ framework, baseDir }) => {
  const { Application } = require(framework);
  let EggLoader;
  try {
    EggLoader = require('egg-core').EggLoader;
  } catch (_) {
    throw new Error('Dont find egg framework in node_modules');
  }

  const loader = new EggLoader({
    baseDir,
    logger,
    app: Object.create(Application.prototype),
  });
  loader.loadPlugin();

  return loader.allPlugins;
};

function noop() {}
