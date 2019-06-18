const Command = require('../../struct/Command');

module.exports = class KissCommand extends Command {
	constructor() {
		super('kiss', {
			aliases: ['kiss'],
			category: 'Fun',
			description: {
        content: 'Use this to kiss someone.',
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