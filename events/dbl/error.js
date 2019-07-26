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
    console.error(`[DiscordBots.org] An error has occured: ${error}`);
  }
}