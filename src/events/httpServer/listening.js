import { Listener } from 'discord-akairo';

export default class httpListeningListener extends Listener {
	constructor() {
		super('httpListening', {
			emitter: 'httpServer',
			event: 'listening',
			category: 'httpServer'
		});
	}

	exec() {
		console.log("Express server listening on port " + this.client.website.express.get('port'));
	}
}