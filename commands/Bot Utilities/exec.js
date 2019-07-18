const { inspect } = require('util')
const Command = require('../../struct/Command');
const exec = require("util").promisify(require("child_process").exec);

module.exports = class ExecCommand extends Command {
	constructor() {
		super('exec', {
			aliases: ['exec'],
			category: 'Bot Utilities',
			description: {
        content: 'Executes a command in the console. Only the bot owners may use this command.',
        usage: '<Commands to Execute>',
        examples: 'msg.channel.send(\'Hi\');'
      },
			ownerOnly: true,

			args: [
				{
					id: 'script',
					prompt: 'What code would you like to evaluate?',
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

      if (result.includes(this.client.token)) result = result.replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')
			const output = result.stdout ? `${"```sh"}\n${result.stdout}\n${"```"}` : "";
  		const outerr = result.stderr ? `${"```sh"}\n${result.stderr}\n${"```"}` : "";

			if (output2.length > 1990) {
				return msg.channel.send(new MessageAttachment(Buffer.from(output), "output.txt"));
			}
			if (outerr2.length > 1990) {
				return msg.channel.send(new MessageAttachment(Buffer.from(outerr), "outerr.txt"));
			}

      msg.channel.send(!!outerr ? outerr : output, {code: 'bash'})

    } catch(err) {
      console.error(err)

      const error = err.toString().replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')
      return msg.channel.send(error, {code: 'bash'})
    }
  }
};
