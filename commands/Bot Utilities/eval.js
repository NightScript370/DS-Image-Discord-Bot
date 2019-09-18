const { inspect } = require('util')
const Command = require('../../struct/Command');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'Bot Utilities',
			description: {
				content: 'Executes JavaScript code. Only the bot owners may use this command.',
				usage: '<Javascript Code to Execute> [--deleteog if you want to delete your message] [--hideresponce if you would like to hide the bot response]',
				examples: 'msg.channel.send(\'Hi\');'
			},
			ownerOnly: true,

			args: [
				{
					id: 'script',
					description: "This is the code you would like to run",
					prompt: {
						start: (msg) => global.getString(msg.author.lang, 'What code would you like to evaluate?'),
						retry: (msg) => global.getString(msg.author.lang, 'That is not something we can evaluate. Try again')
					},
					type: 'string',
					match: "rest"
				},
				{
					id: 'deleteog',
					description: "This deletes the original message which executed the eval command.",
					match: 'flag',
					flag: '--deleteog'
				},
				{
					id: 'hideresponce',
					description: "Normally, a result of your Javascript code will be given. Using the --hideresponce flag, you no longer get a result for that eval instance",
					match: 'flag',
					flag: '--hideresponce'
				}
			]
		});
	}

	async exec(msg, { script, hideresponce, deleteog }) {
		const client = this.client;
		const channel = msg.channel;
		const message = msg;

		try {
			let result = await eval(script);
			if (typeof result !== 'string') {
				result = inspect(result, {
					depth: 0,
				});
			}

			result.replaceAll(this.client.token, '"<insert client token here>."')

			if (this.client.dbl && this.client.dbl.token)
				result.replaceAll(this.client.dbl.token, '"<insert DiscordBots.org token here>"');

			if (result.length > 1990) {
				console.log(result);
				msg.reply('Too long to be printed (content got console logged)');
			} else if(!hideresponce) {
				msg.channel.send(result, {code: 'js'});
			}

			if (deleteog)
				msg.delete();
		} catch(err) {
			console.error(err);

			const error = err.toString().replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."');
			return msg.channel.send(error, {code: 'js'});
		}
	}
};