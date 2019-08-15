const { Command } = require('discord-akairo');

module.exports = class COD4Command extends Command {
  constructor() {
    super('callOfDuty4', {
      category: 'Game Server Statistics',
      aliases: ["callOfDuty4", "cod4"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any Call of Duty 4: Modern Warfare game server.',
      args: [{
        id: 'IP',
        prompt: {
          start: 'Which server would you like to get Call Of Duty 4 server statistics from?',
          retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP',
        match: 'content'
      }]
    });

    this.examples = ['callOfDuty4 139.59.31.128:27016'];
  }

  async exec(message, { IP }) {
    let {embed, data} = this.gameDigServer('cod4', IP);
    message.channel.send({embed});
  }
};