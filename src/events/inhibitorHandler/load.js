import discordAkairo from 'discord-akairo';

export default class inhibitorLoadListener extends discordAkairo.Listener {
	constructor() {
		super('inhibitorHandlerLoad', {
			emitter: 'inhibitorHandler',
			event: 'load',
			category: 'inhibitorHandler'
		});
	}

	exec(cmd, reload) {
		if (reload)
			console.log(`[INHIBITOR][RELOAD] ${cmd.id} reloaded`);
		else
			console.log(`[INHIBITOR][LOAD] ${cmd.id} loaded`);
	}
}