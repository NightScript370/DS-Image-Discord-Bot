import Listener from 'discord-akairo';

export default class CommandLoadListener extends Listener {
	constructor() {
		super('commandHandlerLoad', {
			emitter: 'commandHandler',
			event: 'load',
			category: 'commandHandler'
		});
	}

	exec(cmd, reload) {
		if (reload)
			console.log(`[COMMAND][RELOAD] ${cmd.id} reloaded`);
		else
			console.log(`[COMMAND][LOAD] ${cmd.id} loaded`);
	}
}