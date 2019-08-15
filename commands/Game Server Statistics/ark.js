const { Command } = require('discord-akairo');

module.exports = class ARKCommand extends Command {
  constructor() {
    super('ark', {
      category: 'Game Server Statistics',
      aliases: ["ark", "arkse"],
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content:'Get stats of any Battlefield: 1942 game server.',
        usage: '<server IP>',
        examples: ['163.172.13.221:14567']
      },
      args: [{
        id: 'IP',
        prompt: {
          start: 'Which server would you like to get `ARK: Survival Evolved` statistics from?',
          retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP'
      }]
    });
  }

  async exec(message, { IP }) {
    let {embed, data} = this.gameDigServer('arkse', IP);

    message.channel.send({embed});
  }
};