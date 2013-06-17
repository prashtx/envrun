#!/usr/bin/env node
/*jslint node: true */
'use strict';

var spawn = require('child_process').spawn;
var optimist = require('optimist');
var fs = require('fs');
var path = require('path');

var argv = optimist
.default('e', '.env')
.demand(1)
.usage('Run a command with a specified environment.\nUsage: $0')
.describe('e', 'Specify an environment file.')
.describe('p', 'Specify a value for the PORT environment variable. Defaults to 3000 or whatever is specified in the .env file.')
.argv;

function resolve(cmd) {
  var prefixes = process.env.PATH.split(':');
  prefixes.push(process.cwd());
  var i;
  for (i = 0; i < prefixes.length; i += 1) {
    var full = path.resolve(prefixes[i], cmd);
    if (fs.existsSync(full)) {
      return full;
    }
  }
}

function getEnv(filename, port) {
  if (!fs.existsSync(filename)) {
    console.log('Could not find environment file: ' + filename);
    process.exit(1);
  }
  var file = fs.readFileSync(filename, 'utf8');

  var env = {};

  var lines = file.split('\n');
  var re = /^[ ]*([a-zA-Z][a-zA-Z0-9_]*)=(".*"|'.*'|[^# ]*)/;
  lines.forEach(function (line) {
    var match = re.exec(line);
    if (match === null) {
      return;
    }
    var key = match[1];
    var value = match[2];

    // If there are quotation marks, make sure they match and remove them.
    var removeQuotes = false;
    if (value[0] === '"') {
      if (value[value.length - 1] !== '"') {
        return;
      }
      removeQuotes = true;
    } else if (value[0] === '\'') {
      if (value[value.length - 1] !== '\'') {
        return;
      }
      removeQuotes = true;
    }

    if (removeQuotes) {
      value = value.slice(1,-1);
    }

    env[key] = value;
  });

  // Default value of PORT is 3000. If the environment file specifies
  // otherwise, use that. And if we specified something as a command-line
  // option, that takes precedence.
  if (port !== undefined) {
    env.PORT = port;
  } else if (env.PORT === undefined) {
    env.PORT = 3000;
  }

  return env;
}

var cmd = argv._[0];
var args = argv._.slice(1);
var env = getEnv(argv.e, argv.p);
cmd = resolve(cmd);
spawn(cmd, args, {
  stdio: 'inherit',
  env: env,
  cwd: process.cwd()
})
.on('error', function (error) {
  console.log('Error!');
  console.log(error.message);
  console.log(error);
  process.exit(1);
});
