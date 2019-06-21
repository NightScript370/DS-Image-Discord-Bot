const { inspect } = require('util')
const Command = require('../../struct/Command');
const {execSync} = require('child_process');

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

	async exec(msg, { script }) {
		execSync('git fetch origin && git reset --hard origin/master')

		message.channel.send(`Bot updated successfully`)
	}
};
