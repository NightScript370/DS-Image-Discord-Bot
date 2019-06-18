const { Listener } = require('discord-akairo');

module.exports = class errorListener extends Listener {
  constructor() {
    super('error', {
      emitter: 'client',
      event: 'error',
      category: 'botHandler'
    });
  }

    exec(error) {
		  console.error(error);
	}
}