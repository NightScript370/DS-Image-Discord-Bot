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
			},
			ownerOnly: true,
		});
	}

	exec(message) {
		let responce = message.channel.send('Updating bot');
		
		try {
			execSync('git fetch origin && git reset --hard origin/master')
			responce.edit('Bot edited successfully, please reload the changes')
		} catch (e) {
			console.error(e)
			responce.edit('There was an error when updating the bot. Please try again')
		}
	}
};
