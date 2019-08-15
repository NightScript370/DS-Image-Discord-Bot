const { Command } = require('discord-akairo');

module.exports = class BF1942Command extends Command {
  constructor() {
    super('BattleField1942', {
      category: 'Game Server Statistics',
      aliases: ["BattleField1942", "bf1942"],
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content:'Get stats of any Battlefield: 1942 game server.',
        usage: '<server IP>',
        examples: ['163.172.13.221:14567']
      },
      args: [{
        id: 'IP',
        prompt: {
          start: 'Which server would you like to get `Battlefield: 1942` statistics from?',
          retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP'
      }]
    });
  }

  async exec(message, { IP }) {
    let {embed, data} = this.gameDigServer('bf1942', IP)

    message.util.reply(`Information on the "${data.name}" BattleField 1942 server` + message.guild ? `, requested by ${message.member.displayName}` : '', {embed});
  }
};