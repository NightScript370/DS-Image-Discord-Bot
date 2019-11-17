import { inspect } from 'util';
import Command from '../../struct/Command';
const exec = require("util").promisify(require("child_process").exec);

export default class ExecCommand extends Command {
	constructor() {
		super('exec', {
			aliases: ['exec'],
			category: 'Bot Utilities',
			description: {
				content: 'Executes code in the console. Only the bot owners may use this command.',
				usage: '<Code to Execute>',
				examples: 'pnpm update'
			},
			ownerOnly: true,
			args: [
				{
					id: 'script',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'What code would you like to execute?'),
						retry: (msg) => global.translate(msg.author.lang, "That is not code we can execute in the console.")
					},
					type: 'string',
					match: "content"
				}
			]
		});
	}

	async exec(msg, { script }) {
		const client = this.client;
		const channel = msg.channel;
		const message = msg;

		try {
			let result = await exec(script).catch((err) => { throw err; });

			const output = result.stdout ? "```sh\n" + result.stdout + "```" : "";
			const outerr = result.stderr ? "```sh\n" + result.stderr + "```" : "";

			if (output.includes(this.client.token)) output = output.replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')
			if (outerr.includes(this.client.token)) outerr = outerr.replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')

			if (output.length > 1990) {
				return msg.channel.send(new MessageAttachment(Buffer.from(output), "output.txt"));
			}
			if (outerr.length > 1990) {
				return msg.channel.send(new MessageAttachment(Buffer.from(outerr), "outerr.txt"));
			}

			msg.channel.send(!!outerr ? outerr : output)

		} catch(err) {
			console.error(err)

			const error = err.toString().replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')
			return msg.channel.send(error, {code: 'bash'})
		}
	}
};
