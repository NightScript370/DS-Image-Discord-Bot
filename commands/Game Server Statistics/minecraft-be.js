const Command = require('../../struct/Command');

module.exports = class MCBedrockCommand extends Command {
  constructor() {
    super('minecraft-be', {
      category: 'Game Server Statistics',
      aliases: ["minecraft-be", "mcbe"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any Minecraft: Bedrock Edition game server.',
      args: [
        {
          id: 'IP',
          prompt: {
            start: 'Which server would you like to get `Minecraft: Bedrock Edition` statistics from?',
            retry: 'That\'s not a server we can get stats from! Try again.'
          },
          type: 'string',
          match: 'content'
        }
      ]
    });

    this.examples = ['minecraft-be 138.201.33.99:19132'];
  }

  async exec(message, { IP }) {
    let { embed, data } = await this.gameDigServer('minecraftbe', IP);
    embed
      .setThumbnail("http://www.rw-designer.com/icon-image/5547-256x256x32.png")
      .setColor("GREEN")

    message.util.reply(`Information on the "${data.name}" Minecraft (Bedrock Edition) server` + message.guild ? `, requested by ${message.member.displayName}` : '', {embed});
  }
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}