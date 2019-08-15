const { Command } = require('discord-akairo');

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
          type: 'string'
        }
      ]
    });

    this.examples = ['minecraft-be 138.201.33.99:19132'];
  }

  async exec(message, { IP }) {
    let {embed, data} = this.gameDigServer('minecraftbe', IP);
    message.channel.send({embed});
  }
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}