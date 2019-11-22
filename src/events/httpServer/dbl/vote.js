import { Listener } from 'discord-akairo';

export default class DBLVotedListener extends Listener {
	constructor() {
		super('vote', {
			emitter: 'dblwebhook',
			event: 'vote',
			category: 'dbl'
		});
	}

	async exec(vote) {
		if (vote.type == 'test')
			return console.log('test successful');

		let message;
		try {
			let fetchedUser;
			if (this.client.users.has(vote.user))
				fetchedUser = this.client.users.get(vote.user)
			else
				fetchedUser = await this.client.users.fetch(vote.user);

			message = `${fetchedUser.tag} just upvoted on DiscordBots.org!`;
		} catch {
			message = `${vote.user} upvoted on DiscordBots.org`;
		}

		this.client.channels.get(this.client.log.upvote).send(message);
		console.log(`[DiscordBots.org] User with ID ${vote.user} just voted!`);
	}
}