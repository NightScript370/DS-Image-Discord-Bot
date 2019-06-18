const Command = require('../../struct/Command');

module.exports = class KillCommand extends Command {
	constructor() {
		super('kill', {
			aliases: ['kill'],
			category: 'Fun',
			description: {
        content: 'Use this to kill someone.',
        usage: '<user. Leave blank for action on yourself>',
        examples: ['178261738364338177']
      },
      args: [
        {
          id: 'victim',
          type: 'user',
          default: msg => msg.author,
          match: 'content'
        },
      ],
		});
	}

	async exec(message, { victim }) {
    let phrase = this.weirdUselessAnimeButEnjoyableToOthersForSomeReason(message, victim)
    message.util.send(phrase.text)
	}
};