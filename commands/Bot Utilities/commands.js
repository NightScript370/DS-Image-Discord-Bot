const { Command } = require('discord-akairo');

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
        const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v)

        let helpCmds;
        let CmdDesc;

        let categories = Array.from(this.client.commandHandler.categories.entries());
        let catNames = categories.map(arr => arr[0]);
        let cats = categories.map(arr => arr[1]).sort((c1, c2) => c1.id.localeCompare(c2.id));

        let cmds = cats.map(cat => Array.from(cat.entries()).map(c => c[1])).flat();

        if (commandName) {
            if (cmds.some(cmd => cmd.aliases.includes(commandName))) {
                // Command exists
                let command = cmds.filter(cmd => cmd.aliases.includes(commandName))[0];

                let commandEmbed = this.client.util.embed()
                    .setTitle(__('Help for command "{0}"', command.id))
                    .setImage(`${this.client.URL}/examples/${command.id}.png`);

                if (command.category)
                    commandEmbed.addInline(__("Category"), __(command.category.id))

                if (command.description) {
                    let description = command.description
                    if (command.description.content)
                        description = command.description.content;

                    if (typeof description == 'string')
                        commandEmbed.setDescription(description)

                    if (description.join)
                        commandEmbed.setDescription(description.map(d => __(d)).join("\n"))
                }

                let commandPermissions = [];
                if (command.userPermissions)
                    try {command.userPermissions.forEach(perm => commandPermissions.push('`' + perm + '`'))} catch (e) {}

                switch (command.channelRestriction) {
                    case 'guild':
                        commandPermissions.push('Server Only');
                        break;
                    case 'dm':
                        commandPermissions.push('Direct Messages Only');
                        break;
                }

                if (command.ownerOnly)
                    commandPermissions.push('Owner only');

                commandPermissions.join(' | ')

                if (!isEmpty(commandPermissions))
                    commandEmbed.addInline('Restrictions', commandPermissions);

                let usage;
                if (command.description && command.description.usage)  usage = command.description.usage;
                if (command.usage)                                     usage = command.usage;

                if (usage)  commandEmbed.addField(__("Usage"), `\`${usage}\``)

                if (command.aliases.filter(al => al !== command.id).length) {
                    commandEmbed.addField(__("Aliases"), command.aliases.filter(al => al !== command.id).map(alias => `\`${alias}\``).join(", "))
                }

                let exampleArray;
                if (command.description && command.description.examples) exampleArray = command.description.examples;
                if (command.examples)                                    exampleArray = command.examples;

                if (exampleArray) {
                    if (typeof exampleArray == 'string')
                        commandEmbed.addField(__("Examples"), `\`${exampleArray}\``)
                    else
                        commandEmbed.addField(__("Examples"), exampleArray.map(example => "`" + example + "`").join("\n"));
                }

                return msg.channel.send(commandEmbed);
            } else {
                let e = this.client.util.embed();

                cats.forEach(category => {
                    if (__(category.id).toUpperCase() !== commandName.toUpperCase()) return;

                    let catCmds = cmds.filter(c => c.category.id == category).sort((a, b) => a.id.localeCompare(b.id));
                    let s = [];
                    let makeFields = catCmds.length < 20;
                    catCmds.forEach(cmd => {
                        if (!makeFields) {
                            helpCmds = `**${cmd.id}**`;
                            if (!isEmpty(cmd.description)) {
                                helpCmds += ': ';

                                if (typeof cmd.description == 'string') helpCmds += __(cmd.description)
                                else                                    helpCmds += __(cmd.description.content)
                            }

                            s.push(helpCmds)
                        } else {
                            if (!isEmpty(cmd.description)) {
                                if (typeof cmd.description == 'string') CmdDesc = __(cmd.description)
                                else                                    CmdDesc = __(cmd.description.content)
                            }
                            e.addField(cmd.id, CmdDesc || __('No description available'))
                        }
                    });

                    if (!makeFields)
                        s.join('\n');

                    if (catCmds.length > 0) {
                        e
                            .setTitle(__("Category listing: {0}", __(category)))
                            .setFooter(__("Total Commands: {0}", catCmds.length));

                        if (!makeFields) {
                            e.setDescription(s)
                        }

                        return msg.channel.send(e);
                    }
                });
            }
        } else {
            // General command listing
            // {id: <name>, aliases: [<name>, <name>...], description: <desc>, category.id: <category>}
            let prefix = await this.handler.prefix(msg);

            let e = this.client.util.embed()
                .setAuthor(__('Command Listing'), this.client.user.displayAvatarURL({format: 'png'}), `${this.client.URL}/commands`)
                .setDescription(__('To view a list of all the commands, go to the [Yamamura Website Command Page]({0}).', `${this.client.URL}/commands`) + " \n"
                              + __("To view a list of a command of a specific category, type `{0}commands (category name)`.", prefix));

            cats.forEach(category => {
                let catCmds = cmds.filter(c => c.category.id == category).sort((a, b) => a.id.localeCompare(b.id));
                if (catCmds.length > 0) e.addInline(`${__(category)} [${catCmds.length}]`, category.description ? __(category.description) : __('No description available.'));
            });

            e.setFooter(__("Total Commands: {0}", cmds.length));

            return msg.channel.send(e);
        }
    }
};

// Polyfill
if (!Array.prototype.flat) {
  Array.prototype.flat = function() {
    var depth = arguments[0];
    depth = depth === undefined ? 1 : Math.floor(depth);
    if (depth < 1) return Array.prototype.slice.call(this);
    return (function flat(arr, depth) {
      var len = arr.length >>> 0;
      var flattened = [];
      var i = 0;
      while (i < len) {
        if (i in arr) {
          var el = arr[i];
          if (Array.isArray(el) && depth > 0)
            flattened = flattened.concat(flat(el, depth - 1));
          else flattened.push(el);
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
