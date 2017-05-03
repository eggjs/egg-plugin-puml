#!/usr/bin/env node

'use strict';

const Command = require('common-bin').Command;
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
    puml({
      baseDir: argv._[0],
      framework: argv.framework,
      dest: argv.dest,
    });
  }
}

new PumlCommand().start();
