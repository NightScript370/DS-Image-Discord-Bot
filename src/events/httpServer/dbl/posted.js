import { Listener } from 'discord-akairo';

export default class DBLPostedListener extends Listener {
	constructor() {
		super('posted', {
			emitter: 'dbl',
			event: 'posted',
			category: 'dbl'
		});
	}

	exec() {
		console.log('[DiscordBots.org] Server count posted!');
	}
}