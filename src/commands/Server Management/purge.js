import { Command } from 'discord-akairo';
import { javierInteger } from '../../utils/types.js';

export default class PurgeCommand extends Command {
	constructor() {
		super('purge', {
			aliases: ["purge", "prune", 'clean', 'cleanup', 'clean-up'],
			category: 'Server Management',
			description: {
				content: "Cleans a channel of however many messages you'd like with other filters."
			},
			examples: ["100 user:178261738364338177 matchRegex:"],
			channel: 'guild',
			clientPermissions: ["MANAGE_MESSAGES"],
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					id: 'amount',
					description: "This is the amount of messages that you'd like to clean up. The maximum is 100 and the minimum is 1",
					type: (message, number) => {
						if (!number)
							return null;

						const returnvalue = javierInteger(message, number);
						if (isNaN(returnvalue)) return null;
						if (returnvalue == null) return null;

						if (returnvalue < 1) return null;
						if (returnvalue > 100) return null;

						return returnvalue;
					},
					prompt: {
						start: "How many messages would you like to delete from this channel?",
						retry: "That's not a valid ammount. Please try again!"
					}
				},
				{
					id: "who",
					description: 'by adding `who:` to the command execution message (not the amount prompt, if there is one), you can specify if you want a specific user (put its user ID) or by bot/human status (put "bot"/"human" respectively)',
					default: null,
					type: (msg, phrase) => {
						if (!phrase) return null;
						if (phrase == "bot" || phrase == "human") return phrase;
						return this.client.commandHandler.resolver.types.get("user-commando")(msg, phrase)
					},
					match: 'option',
					flag: 'who:'
				},
				{
					id: "regex",
					default: null,
					type: 'string',
					match: 'option',
					flag: 'matchRegex:'
				},
				{
					id: "startsWith",
					default: null,
					type: 'string',
					match: 'option',
					flag: 'startsWith:'
				},
				{
					id: "includes",
					default: null,
					type: 'string',
					match: 'option',
					flag: 'includes:'
				},
				{
					id: "endsWith",
					default: null,
					type: 'string',
					match: 'option',
					flag: 'endsWith:'
				},
				{
					id: "deleteOld",
					match: 'flag',
					flag: '--deleteOld'
				},
				{
					id: "deletePins",
					match: 'flag',
					flag: '--deletePins'
				},
			]
		});
	}

	async exec(commandMessage, { amount, who, regex, startsWith, includes, endsWith, deleteOld, deletePins }) {
		let messages = await commandMessage.channel.messages.fetch({ limit: amount });

		if (regex) {
			try {
				pattern = new RegExp(pattern);
			} catch(e) {
				return commandMessage.channel.send(':warning: You provided an invalid pattern');
			}

			messages = await messages.filter(message => message.content.match(pattern));
		}

		if (startsWith)
			messages = await messages.filter(message => message.content.startsWith(startsWith));

		if (includes)
			messages = await messages.filter(message => message.content.includes(includes));

		if (endsWith)
			messages = await messages.filter(message => message.content.endsWith(endsWith));

		if (who)
			messages = await messages.filter(message => (who == "bot" ? message.author.bot : message.author == who));

		if(!deletePins)
			messages = await messages.filter(message => !message.pinned);

		// messages.delete(commandMessage.id);
		if (!messages.size)
			return commandMessage.channel.send(`There was no results for your query. Try again`);

		const msgBulkDelete = await commandMessage.channel.bulkDelete(messages, deleteOld);
		let successmessage = await commandMessage.channel.send(messages.size + " message" + (messages.size != 1 ? "s" : "") + " deleted!");
		await successmessage.delete({timeout: 5000});
	}
};