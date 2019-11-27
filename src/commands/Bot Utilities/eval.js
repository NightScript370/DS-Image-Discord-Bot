import { inspect } from 'util';
import Command from '../../struct/Command.js';

import discordJS from 'discord.js';
const { splitMessage } = discordJS
const escapeRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

export default class EvalCommand extends Command {
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
						start: (msg) => global.translate(msg.author.lang, 'What code would you like to evaluate?'),
						retry: (msg) => global.translate(msg.author.lang, 'That is not something we can evaluate. Try again')
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

		this.lastResult = null;
		Object.defineProperty(this, '_sensitivePattern', { value: null, configurable: true });
	}

	async exec(msg, { script, hideresponce, deleteog }) {
		const client = this.client;
		const channel = msg.channel;
		const message = msg;
		const guild = msg.guild;

		const lastResult = this.lastResult;

		let hrDiff;
		try {
			const hrStart = process.hrtime();
			this.lastResult = await eval(script);
			hrDiff = process.hrtime(hrStart);
		} catch(err) {
			return msg.reply(`Error while evaluating: \`${err}\``);
		}

		// Prepare for callback time and respond
		this.hrStart = process.hrtime();
		if (!hideresponce) {
			const result = this.makeResultMessages(this.lastResult, hrDiff, script);

			if(Array.isArray(result)) {
				return result.map(item => msg.reply(item));
			} else {
				return msg.reply(result);
			}
		}

		if (deleteog)
			msg.delete();
	}

	makeResultMessages(result, hrDiff, input = null) {
		const inspected = inspect(result, { depth: 0 })
			.replace(/!!NL!!/g, '\n')
			.replace(this.sensitivePattern, '--snip--');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
			split[split.length - 1] :
			inspected[last];
		const prepend = `\`\`\`javascript\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;

		let replyMessage = (input ? "Executed in" : "Callback executed after") + " " + (hrDiff[0] > 0 ? `${hrDiff[0]}s ` : '') + (`${hrDiff[1] / 1000000}ms`);
		replyMessage = "*" + replyMessage + ".*";
		replyMessage += "```javascript\n" + inspected + "```"

		return splitMessage(replyMessage, { maxLength: 1950, prepend, append });
	}

	get sensitivePattern() {
		if(!this._sensitivePattern) {
			const client = this.client;
			let pattern = '';
			if(client.token) pattern += escapeRegex(client.token);
			Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi'), configurable: false });
		}
		return this._sensitivePattern;
	}
};