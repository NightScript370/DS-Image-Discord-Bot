import { Listener } from 'discord-akairo';

export default class DBLHookReadyListener extends Listener {
	constructor() {
		super('DBLhookReady', {
			emitter: 'dblwebhook',
			event: 'ready',
			category: 'dbl'
		});
	}

	exec(hook) {
		console.log(`[DiscordBots.org] Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
	}
}