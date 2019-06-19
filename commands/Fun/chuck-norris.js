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
					type: 'string',
					match: 'content',
					default: 'Chuck'
				}
			]
		});
	}

	async exec(msg, { name }) {
		try {
			const { body } = await request
				.get('http://api.icndb.com/jokes/random')
				.query({
					escape: 'javascript',
					firstName: name
				});
      		return msg.util.send(body.value.joke);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};