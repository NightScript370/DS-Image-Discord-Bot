const { Command } = require('discord-akairo');

module.exports = class PurgeCommand extends Command {
	constructor() {
		super('purge', {
			aliases: ["purge", "prune", 'clean', 'cleanup', 'clean-up'],
			category: 'Moderation',
			description: {
                content: "Cleans a channel of how many messages you'd like (as long as it isn't over 100). You can specify if you want just bot messages to be cleaned, only from a specific user or if the message matches a regex type"
            },
			examples: ["100 user:178261738364338177 matchRegex:"],
			channelRestriction: 'guild',
			clientPermissions: ["MANAGE_MESSAGES"],
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					id: 'amount',
					type: (msg, phrase) => {
                        if (!phrase || isNaN(phrase)) return null;
                        const num = parseInt(phrase);
                        if (num > 100) return null;
                        return num;
                    },
                    prompt: {
                        start: "How many messages would you like to delete from this channel",
                        retry: "That's not a valid ammount."
                    }
				},
				{
					id: "who",
					default: null,
					type: (msg, phrase) => {
                        if (phrase == "bot") return phrase;
                        return this.client.commandHandler.resolver.types.get("user-commando")
                    },
                    match: 'option',
                    flag: 'user:'
				},
				{
					id: "regex",
					default: null,
					type: 'string',
                    match: 'option',
                    flag: 'matchRegex:'
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

	async exec(commandMessage, { amount, who, regex, deleteOld, deletePins }) {
        commandMessage.channel.send(`Debugging: ${amount} = amount, ${who} = who, ${regex} = regex, ${deleteOld} = deleteOld, ${deletePins} = deletePins`)
        let messages = await commandMessage.channel.messages.fetch({ limit: amount });

        if (regex) {
            try {
                pattern = new RegExp(pattern);
            } catch(e) {
                return commandMessage.channel.send(':warning: You provided an invalid pattern');
            }

            messages = await messages.filter(message => message.content.match(pattern));
        }

        if (who && who == "bot") {
            messages = await messages.filter(message => message.author.bot);
        } else if (who) {
            messages = await messages.filter(message => message.author == who);
        }

        if(!deletePins)
            messages = await messages.filter(message => !message.pinned);

        // messages.delete(commandMessage.id);
        if (!messages.size)
            return commandMessage.channel.send(`There was no results for your query. Try again`);

        try {
            const msgBulkDelete = await commandMessage.channel.bulkDelete(messages, deleteOld);
            let successmessage = await message.channel.send(messages.size + " message" + (messages.size != 1 ? "s" : "") + " deleted!");
            await successmessage.delete({timeout: 5000});
        } catch (e) {
            msg.reply('There was an error when attempting to delete the messages. Please contact the Yamamura developers');
            console.error(e);
        }
    }
};