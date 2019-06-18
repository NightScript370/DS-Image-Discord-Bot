const { Listener } = require('discord-akairo');

module.exports = class warnListener extends Listener {
  constructor() {
    super('warn', {
      emitter: 'client',
      event: 'warn',
      category: 'botHandler'
    });
  }

    exec(error) {
		  console.warn(error);
	}
}