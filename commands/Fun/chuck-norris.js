const { Command } = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class ChuckNorrisCommand extends Command {
	constructor() {
		super('chuck-norris', {
			aliases: ["chuck-norris", 'norris'],
			category: 'Fun',
			description: {
				content: 'Says a random chuck noris joke.'
			},
			credit: [
				{
					name: 'The Internet Chuck Norris Database API',
					url: 'http://www.icndb.com/api/'
				}
			],
			args: [
				{
					id: 'name',
					type: async (msg, what) => {
                        if (!what) return null;

                        let user = await msg.client.commandHandler.resolver.types.get("user-commando")(msg, what);
                        if (user) return user.username;

                        return what;
                    },
					match: 'content',
					default: 'Chuck'
				}
			]
		});
	}

	async exec(message, { name }) {
		const { body } = await request
			.get('http://api.icndb.com/jokes/random')
			.query({
				escape: 'javascript',
				firstName: name
			});

		if (message.channel.sendable)
    		return msg.util.send(body.value.joke);
	}
};