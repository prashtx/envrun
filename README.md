# envrun

Run a command using environment variables declared in a file.

## Summary

Envrun mimics the behavior of Foreman but applied to running arbitrary commands
rather than processes declared in a Procfile. By default, envrun reads
environment variables from a file called `.env` and adds a `PORT` variable set
to `3000`. If you haven't guessed, I use this for running Node.js scripts and
services on my development machine.

## Installation

Install with `npm install envrun -g`.

## Usage

The basic form takes a command to be executed and reads the environment variables from `.env`:

    $ envrun my-script.sh

You can provide arguments to the command:

    $ envrun node my-utility.js

You can override the default `PORT` value with `-p`:

    $ envrun -p node server.js

You can of course specify a different environment file with `-e`:

    $ envrun -e remote-dev.env node my-utility.js

A value provided by `-p` takes precedence over a `PORT` value from the
environment file, which takes precendence over the default value of `3000`.

If you want to include the calling environment's `PATH`, then use the `--path` flag:

    $ envrun --path mocha

You can confirm what's going on with your OS's `env` command:

    $ envrun env

## Sample environment file

```
DATABASE="my_dev_db"
S3_KEY=sodif7s297ydh297yh92
NAME="My Full Name" # Comments are OK
# The line below will get ignored
#LOGGING=QUIET
```

