const { inspect } = require('util')
const Command = require('../../struct/Command');
const { execSync } = require('child_process');

module.exports = class UpdateCommand extends Command {
	constructor() {
		super('update', {
			aliases: ['update'],
			category: 'Bot Utilities',
			description: {
				content: 'Updates the bot to the latest commit.',
				usage: '',
				examples: ''
			},
			ownerOnly: true,
		});
	}

	async exec(message, { script }) {
		let responce = message.channel.send('Updating bot');
			execSync('git fetch origin && git reset --hard origin/master')
				.then(responce.edit(`Bot updated successfully`))
				.catch((e) => {
					console.error(e)
					responce.edit('There was an error when updating the bot. Please try again')
				})
	}
};
