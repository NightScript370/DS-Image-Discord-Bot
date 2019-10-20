const { Command } = require('discord-akairo');

module.exports = class ClapCommand extends Command {
	constructor() {
		super('clap', {
			category: 'Text Fun',
			aliases: ["clap"],
			description: {
				content: 'Add a clap emoji between every word.',
				usage: '<stentence to clapify>',
				examples: ['hello there friend', 'here we go again']
			},
			args: [{
				id: 'toClap',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { toClap }) {
		if (!toClap)
			toClap = global.lang.getString(message.author.lang, "I :clap: need :clap: text :clap: to :clap: clap :clap: to!");

		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.lang.getString(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		if (!toClap.includes(" "))
			return message.util.send(this.chunk(toClap, 1).join(" :clap: "), (embed && message.channel.embedable ? {embed} : {}))

		message.util.send(toClap.replace(/\s+/gmi, " :clap: "), (embed && message.channel.embedable ? {embed} : {}));
	}

	chunk(str, n) {
		var ret = [];
		var i;
		var len;

		for (i = 0, len = str.length; i < len; i += n) {
			ret.push(str.substr(i, n))
		}

		return ret
	};
};