const { Command } = require('discord-akairo');

module.exports = class rulesCommand extends Command {
  constructor() {
    super("rules", {
      category: 'Useful',
      aliases: ["rules"],
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: `Manage server rules (WIP command, will not work).`,
      },
      args: [
        {
          id: 'action',
          default: "view",
          type: [["view", ""], ["get"], ["set"], ["clear", "reset"]]
        },
        {
          id: 'key',
          default: null,
          type: 'string'
        },
        {
          id: 'guild',
          type: 'guild',
          default: msg => {
            if (msg.guild)  return msg.guild;
            else            return null;
          },
          match: 'option',
          flag: 'guild:',
          unordered: true
        }
      ]
    });
  }

  async exec(msg, { action, key, guild }) {
    msg.reply('This is a WIP command, and as such does not work. Please try again later')
    if (!guild) return msg.reply('there needs to be a set server in order for this to work in Direct Messages');
    let member = guild.members.get(msg.author.id)

    switch (action) {
      case 'set':
        // I'd suggest not using userPermissions, otherwise the event won't fire for users who want to see a rule
        // I'd put the check in the exec() function or the userPermissions() function
        if (!member.hasPermission('ADMINISTRATOR'))
          return msg.reply('In order to set a rule, you need to have the `ADMINISTRATOR` permission.')

        // !rules set piracy
        // Asks what title is
        // Asks description
        // Asks category

        if (!key)
          return msg.reply('In order to set a rule, you need to have the rule index.')

        let keyAlreadyExists = this.client.db.rules.findOne({guild: guild.id, index: key});
        if (keyAlreadyExists) msg.reply('The key already exists. This will overwrite it')

        break;
      case 'view':
        let ruleList = this.client.db.rules.find({guild: guild.id})
    }
  }
};