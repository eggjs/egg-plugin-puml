#!/usr/bin/env node

'use strict';

const Command = require('common-bin');
const puml = require('./index');

class PumlCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);

    this.usage = 'Usage: puml [baseDir]';
    this.options = {
      dest: {
        type: 'string',
        description: 'Directory that the file writing to',
      },
      framework: {
        type: 'string',
        description: 'Directory where framework is',
      },
    };
  }

  * run({ argv }) {
    const baseDir = argv._[0] || process.cwd();
    puml({
      baseDir,
      framework: argv.framework || baseDir,
      dest: argv.dest,
    });
  }
}

const c = new PumlCommand();
c.start();
