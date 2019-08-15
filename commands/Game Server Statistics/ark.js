const Command = require('../../struct/Command');

module.exports = class ARKCommand extends Command {
  constructor() {
    super('ark', {
      category: 'Game Server Statistics',
      aliases: ["ark", "arkse"],
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get stats of any Ark: Survival Evolved game server.',
        usage: '<server IP>',
        examples: ['163.172.13.221:14567']
      },
      args: [
        {
          id: 'IP',
          prompt: {
            start: 'Which server would you like to get `ARK: Survival Evolved` statistics from?',
            retry: 'That\'s not a server we can get stats from! Try again.'
          },
          type: 'externalIP',
          match: 'content'
        }
      ]
    });
  }

  async exec(message, { IP }) {
    let {embed, data} = await this.gameDigServer('arkse', IP);
    embed
      .setColor("BLUE")

    let text = `Information on the "${data.name}" Ark: Survival Evolved server`;
    if (message.guild)
      text += `, requested by ${message.member.displayName}`

    message.util.send(text, {embed});
  }
};