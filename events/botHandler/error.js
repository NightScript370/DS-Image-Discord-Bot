const { Listener } = require('discord-akairo');

module.exports = class discordErrorListener extends Listener {
  constructor() {
    super('discorderror', {
      emitter: 'client',
      event: 'error',
      category: 'botHandler'
    });
  }

    exec(error) {
		  console.error(error);
	}
}