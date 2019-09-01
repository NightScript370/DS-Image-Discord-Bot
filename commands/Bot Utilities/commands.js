const Command = require('../../struct/Command');

module.exports = class CommandsCommand extends Command {
	constructor() {
		super('commands', {
			aliases: ['commands', "cmds"],
			category: 'Bot Utilities',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Sends information on bot commands.'
			},
			args: [
				{
					id: 'commandName',
					type: 'string',
					default: null,
					match: "content"
				}
			]
		});
	}

	async exec(msg, { commandName }) {
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);
		let embed = this.client.util.embed()

		let description;

		let categories = Array.from(this.client.commandHandler.categories.entries());
		let catNames = categories.map(arr => arr[0]);
		let cats = categories.map(arr => arr[1]).sort((c1, c2) => c1.id.localeCompare(c2.id));

		let cmds = cats.map(cat => Array.from(cat.entries()).map(c => c[1])).flat();

		if (this.isGood(commandName)) {
			let command = this.client.commandHandler.aliases.get(commandName);
			if (this.isGood(command)) {
				if (command.description) {
					description = command.description
					if (command.description.content)
						description = command.description.content;

					embed.setDescription(description.join ? description.map(d => __(d)).join("\n") : __(description))
				}

				if (command.aliases.filter(al => al !== command.id).length)
					embed.addField(__("Aliases"), command.aliases.filter(al => al !== command.id).map(alias => `\`${alias}\``).join(", "))

				if (command.category)
					embed.addInline(__("Category"), __(command.category.id))

				let usage;
				if (command.description && command.description.usage)	usage = command.description.usage;
				if (command.usage)										usage = command.usage;

				if (usage)
					embed.addField(__("Usage"), `\`${usage}\``)

				let commandPermissions = [];
				if (this.isGood(command.userPermissions))
					command.userPermissions.forEach(perm => commandPermissions.push('`' + perm + '`'))

				switch (command.channelRestriction) {
					case 'guild':
						commandPermissions.push(__('Server Only'));
						break;
					case 'dm':
						commandPermissions.push(__('Direct Messages Only'));
						break;
				}

				if (command.ownerOnly)
					commandPermissions.push(__('Owner only'));

				if (this.isGood(commandPermissions))
					embed.addInline('Restrictions', commandPermissions.join(' | '));

				let examples;
				if (command.description && command.description.examples)	examples = command.description.examples;
				if (command.examples)										examples = command.examples;

				if (examples)
					embed.addField(__("Examples"), (typeof examples == 'string' ? `\`${examples}\`` : examples.map(example => "`" + example + "`").join("\n")))

				embed.setImage(`${this.client.website.URL}/examples/${command.id}.png`);

				return msg.channel.send(__('Help for command "{0}"', command.id), {embed});
			}

			let category = this.client.commandHandler.categories.get(__(commandName))
			if (!this.isGood(category))
				category = this.client.commandHandler.categories.get(commandName)

			if (!this.isGood(category))
				return msg.util.send(__("Invalid command/category name. Please try again"));

			let commands = cmds.filter(c => c.category.id == category).sort((a, b) => a.id.localeCompare(b.id));
			let makeFields = commands.length < 20;

			description = "";

			let commandList = [];
			commands.forEach(command => {
				description = "";

				if (!makeFields) {
					description += `**${command.id}**`;

					if (this.isGood(command.description)) {
						description += ': ';

						if (command.description.content)
							description += (command.description.content.join ? command.description.content.map(d => __(d)).join("\n") : __(command.description.content));
						else
							description += (command.description.join ? command.description.map(d => __(d)).join("\n") : __(command.description));
					}

					commandList.push(description)
				} else {
					if (this.isGood(command.description)) {
						if (command.description.content)
							description += (command.description.content.join ? command.description.content.map(d => __(d)).join("\n") : __(command.description.content));
						else
							description += (command.description.join ? command.description.map(d => __(d)).join("\n") : __(command.description));
					}

					embed.addField(command.id, description || __('No description available'))
				}
			});

			if (catCmds.length > 0) {
				if (!makeFields)
					embed.setDescription(commandList.join('\n'))

				embed.setFooter(__("Total Commands: {0}", commands.length));

				return msg.channel.send(__("Category listing: {0}", __(category)), embed);
			}
		} else {
			// General command listing
			// {id: <name>, aliases: [<name>, <name>...], description: <desc>, category.id: <category>}
			let prefix = await this.handler.prefix(msg);
			let text = __("{0}'s Command Listing", this.client.user.username) + "\n\n"
					 + __("To view a list of all the commands, please go to our website's command page: {0}", `${this.client.website.URL}/commands`) + " \n"
					 + __("To view a list of a command of a specific category, type `{0}commands (category name)`.", prefix)

			cats.forEach(category => {
				let catCmds = cmds.filter(c => c.category.id == category).sort((a, b) => a.id.localeCompare(b.id));
				if (catCmds.length > 0) embed.addInline(`${__(category.id)} [${catCmds.length}]`, category.description ? __(category.description) : __('No description available.'));
			});

			embed.setFooter(__("Total Commands: {0}", cmds.length));

			return msg.util.send(embed);
		}
	}
};

// Polyfill
if (!Array.prototype.flat) {
	Array.prototype.flat = function() {
		var depth = arguments[0];
		depth = depth === undefined ? 1 : Math.floor(depth);
		if (depth < 1)
			return Array.prototype.slice.call(this);

		return (function flat(arr, depth) {
			var len = arr.length >>> 0;
			var flattened = [];
			var i = 0;
			while (i < len) {
				if (i in arr) {
					var el = arr[i];
					if (Array.isArray(el) && depth > 0)
						flattened = flattened.concat(flat(el, depth - 1));
					else
						flattened.push(el);
				}
				i++;
			}
			return flattened;
		})(this, depth);
	};
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}
