const { Command } = require('discord-akairo');
const answers = require('../../assets/JSON/8-ball');

module.exports = class Number8ballCommand extends Command {
	constructor() {
		super('8-ball', {
			aliases: ['8-ball', "8ball"],
			category: 'Fun',
			description: {
                content: 'Ask your question to the magical 8 ball.',
                usage: '<question>',
                examples: 'Should I play Super Mario Bros today?'
            },
            args: [
                {
                    id: 'question',
                    type: 'question',
                    prompt: {
                        start: 'What would you like to ask the 8-ball?',
                        retry: 'That\'s not a valid question! Try again.'
                    },
                    match: 'content'
                }
            ],
		});
	}

	async exec(message, { question }) {
        const client = await this.client;
        let username = message.member ? message.member.displayName : message.author.username;

        question = question.replace(/<@!?([0-9]*)>/g, (something, id) => {
            let user = client.users.get(id);
            return user ? user.tag : global.getString(message.author.lang, "User not found");
        });
    
		let response = `❓ **${username}'s Question:** ${question}\n🎱 **Answer:** ${answers[Math.floor(Math.random() * answers.length)]}`;
        if (response > 2000) return message.util.reply('Too long');
        message.util.send(response);
	}
};