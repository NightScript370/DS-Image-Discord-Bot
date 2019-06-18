const { Listener } = require('discord-akairo');

module.exports = class DBLErrorListener extends Listener {
  constructor() {
      super('DBLerror', {
        emitter: 'dbl',
        event: 'error',
        category: 'dbl'
      });
  }

  exec(error) {
    console.error(`[DBL] An error has occured: ${error}`);
  }
}