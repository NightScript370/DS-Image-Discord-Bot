const { Listener } = require('discord-akairo');

module.exports = class ReloadListener extends Listener {
    constructor() {
        super('reload', {
            emitter: 'commandHandler',
            event: 'reload',
            category: 'commandHandler'
        });
    }

	exec(cmd) {
		console.log(`[RELOAD] ${cmd.id} reloaded`);
	}
}