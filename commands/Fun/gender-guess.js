import Command from 'discord-akairo';
import get from 'node-superfetch';

export default class GenderGuessCommand extends Command {
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
						if (user)
							return user.username;

						return what;
					},
					match: 'content',
					default: msg => (msg.guild ? msg.member.displayName : msg.user.username)
				}
			]
		});
	}

	async exec(message, { name }) {
		const { body } = await get(`https://api.genderize.io/`)
			.query({ name });

		if (!body.gender)
			return message.util.reply(`I have no idea what gender ${body.name} is.`);

		return message.util.reply(`I'm ${body.probability * 100}% sure ${body.name} is a ${body.gender} name.`);
	}
};