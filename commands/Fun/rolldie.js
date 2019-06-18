const { Command } = require('discord-akairo');
const { random } = require("including-range-array");

module.exports = class RollDieCommand extends Command {
	constructor() {
		super('rolldie', {
			aliases: ['rolldie'],
			category: 'Fun',
			description: {
        content: 'Rolls a die'
      },
		});
	}

	exec(msg) {
    let fellon = random(6, 1)
    msg.util.reply(`Cool, you landed on a ${fellon}!`);
	}
};