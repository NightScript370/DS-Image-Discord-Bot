const { Command } = require('discord-akairo');

module.exports = class CoinFlipCommand extends Command {
	constructor() {
		super('coin', {
			aliases: ['coinflip', "coin-flip", "coin"],
			category: 'Fun',
			description: {
        		content: 'Flips a coin.'
      		},
		});
	}

	exec(msg) {
    	msg.util.reply(Math.random() < 0.5 /* 50% */ ? "you landed on heads." : "you landed on tails.");
	}
};