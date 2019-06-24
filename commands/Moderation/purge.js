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
					default: false,
                    match: 'flag',
                    flag: '--deleteOld'
				},
			]
		});
	}

	async exec(commandMessage, { amount, who, regex, deleteOld }) {
        let messages = commandMessage.channel.fetchMessages({ limit: amount });

        if (regex) {
            try {
                pattern = new RegExp(pattern);
            } catch(e) {
                return commandMessage.channel.send(':warning: You provided an invalid pattern');
            }

            messages = messages.filter(message => message.content.match(pattern));
        }

        if (who && who == "bot") {
            messages = messages.filter(message => message.author.bot);
        } else if (who) {
            messages = messages.filter(message => message.author == who);
        }

        messages.delete(commandMessage.id);
        if (!messages.size)
            return commandMessage.channel.send(`There was no results for your query. Try again`);

        try {
            const msgBulkDelete = await commandMessage.channel.bulkDelete(messages, deleteOld);
            let successmessage = message.channel.send(amount + " message" + (amount > 1 || amount < 1 ? "s" : "") + " deleted!")
            await successmessage.delete({timeout: 5000});
        } catch (e) {
            msg.reply('There was an error when attempting to delete the messages. Please contact the Yamamura developers')
            console.error(e)
        }


    }
};