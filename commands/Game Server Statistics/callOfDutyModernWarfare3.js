const { Command } = require('discord-akairo');

module.exports = class CODMW3Command extends Command {
  constructor() {
    super('callOfDutyModernWarfare3', {
      category: 'Game Server Statistics',
      aliases: ["callOfDutyModernWarfare3", "codmw3"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any Call of Duty: Modern Warfare 3 game server.',
      args: [{
        id: 'IP',
        prompt: {
              start: 'Which server would you like to get `Call of Duty: Modern Warfare 3` statistics from?',
              retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP'
      }]
    });

    this.examples = ['callOfDutyModernWarfare3 139.59.31.129:27019'];
  }

  async exec(message, { IP }) {
    let {embed, data} = await this.gameDigServer('codmw3', IP)
    embed.setThumbnail('http://icons.iconarchive.com/icons/3xhumed/call-of-duty-modern-warfare-3/512/CoD-Modern-Warfare-3-1a-icon.png');

    message.channel.send({embed});
  }
};