const Command = require('../../struct/Command');

module.exports = class RustCommand extends Command {
  constructor() {
    super('rust', {
      category: 'Game Server Statistics',
      aliases: ["rust"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any Rust game server.',
      args: [
        {
          id: 'IP',
          prompt: {
            start: 'Which server would you like to get Rust statistics from?',
            retry: 'That\'s not a server we can get stats from! Try again.'
          },
          type: 'externalIP',
          match: 'content'
        }
      ]
    });

    this.examples = ['rust 139.59.13.119:28015'];
  }

  async exec(message, { IP }) {
    let { embed, data } = await this.gameDigServer('rust', IP);
    embed
      .setColor("#CE422B")
      .setThumbnail(`${this.client.website.URL}/icons/rust.png`)

    message.util.reply(`Information on the "${data.name}" Rust server` + message.guild ? `, requested by ${message.member.displayName}` : '', {embed});
  }
};