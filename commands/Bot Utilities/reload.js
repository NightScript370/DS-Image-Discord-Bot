const { inspect } = require('util')
const { Command } = require('discord-akairo');

module.exports = class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			category: 'Bot Utilities',
			description: {
				content: 'Reloads a command. Only the bot owners may use this command.',
				usage: '[type] <module>'
			},
			ownerOnly: true,
			args: [
				{
					id: "mod",
					description: "This is the module that you would like to reload. It has to be a module of the type that you specified.",
					type: "string",
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'Which module would you like to reload?'),
						retry: (msg) => global.translate(msg.author.lang, 'That is not something we can reload. Try again')
					},
					match: 'rest'
				},
				{
					id: "type",
					description: "This is the type of module that you would like to reload. It can be a command, an inhibitor, a listener or a file",
					type: [['command', 'c'], ['inhibitor', 'i'], ['listener', 'l'], ['file', 'f']],
					default: "command",
					match: 'option',
					flag: 'type:'
				}
			]
		});
	}

	async exec(message, { type, mod }) {
		if (mod == 'file')
			return this.reloadModule(mod);

		let getMod = (msg, phrase) => {
			// console.log(type)
			if (!phrase) return null;
			const resolver = this.handler.resolver.type({
				command: 'commandAlias',
				inhibitor: 'inhibitor',
				listener: 'listener'
			}[type]);
			return resolver(msg, phrase);
		}
		mod = getMod(message, mod);
		if (!mod) {
			return message.util.reply(`invalid ${type} ${type === 'command' ? 'alias' : 'ID'} specified to reload.`);
		}

		try {
			mod.reload();
			return message.util.reply(`sucessfully reloaded ${type} \`${mod.id}\`.`);
		} catch (err) {
			return message.util.reply(`failed to reload ${type} \`${mod.id}\`.`);
		}
	}

	requireModule(module) {
		delete require.cache[require.resolve(module)]
		return require('../../'+module);
	}
};