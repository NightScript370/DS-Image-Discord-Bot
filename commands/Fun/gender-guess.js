const { Command } = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class GenderGuessCommand extends Command {
	constructor() {
		super('gender-guess', {
			aliases: ["gender-guess", 'guess-gender', 'gender'],
			category: 'Fun',
			description: {
				content: "Assumes a gender based on a variable input."
			},
			credit: [
				{
					name: 'Genderize.io',
					url: 'https://genderize.io/'
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
					default: msg => (msg.guild ? msg.member.displayName : msg.user.username)
				}
			]
		});
	}

	async exec(msg, { name }) {
		const { body } = await request
			.get(`https://api.genderize.io/`)
			.query({ name });
		if (!body.gender) return msg.say(`I have no idea what gender ${body.name} is.`);
		return msg.say(`I'm ${body.probability * 100}% sure ${body.name} is a ${body.gender} name.`);
	}
};