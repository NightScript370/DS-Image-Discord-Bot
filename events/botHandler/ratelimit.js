const { Listener } = require('discord-akairo');

module.exports = class rateLimitListener extends Listener {
    constructor() {
        super('rateLimit', {
            emitter: 'client',
            event: 'rateLimit',
            category: 'botHandler'
        });
    }

    exec(rateLimitObj) {
		console.log(`Rate limit reached!\n${require('util').inspect(rateLimitObj)}`);
	}
};
