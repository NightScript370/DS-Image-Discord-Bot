const { inspect } = require('util')
const Command = require('../../struct/Command');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'Bot Utilities',
			description: {
        content: 'Executes JavaScript code. Only the bot owners may use this command.',
        usage: '<Javascript Code to Execute>',
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
      let result = await eval(script);
      if (typeof result !== 'string') {
        result = inspect(result, {
          depth: 0,
        })
      }

      if (result.includes(this.client.token)) result = result.replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')
      if (result.length > 1990) {
        console.log(result)
        return msg.reply('Too long to be printed (content got console logged)')
      }

      msg.channel.send(result, {code: 'js'})

    } catch(err) {
      console.error(err)

      const error = err.toString().replace(this.client.token, '"If someone tried to make you output the token, you were likely being scammed."')
      return msg.channel.send(error, {code: 'js'})
    }
  }
};