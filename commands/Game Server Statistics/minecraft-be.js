const { Command } = require('discord-akairo');
const source = require('gamedig');

module.exports = class MinecraftBedrockServerCommand extends Command {
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
    let embed = await this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 19132;

    try {
      let data = await source.query({
        type: 'minecraftbe',
        host: host,
        port: port
      });

      if (!isEmpty(data.name)) {
        embed
          .setAuthor(`Minecraft Bedrock Server Stats: ${data.name}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
          .addInline(`Server`, `\`${data.connect}\``)
      } else {
        embed
          .setAuthor(`Minecraft Bedrock Server Stats: ${data.connect}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
      }

      embed
        .setColor(`GREEN`)
        .addInline(`Players`, `${data.players.length}/${data.maxplayers}`)
        .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

      if (!isEmpty(data.raw.map))      embed.addInline('Map', data.raw.map)
      if (!isEmpty(data.raw.gametype)) embed.addInline(`Gametype`, data.raw.gametype)

      if (data.password) {
        embed.setFooter(`Private Server • Version: ${data.raw.version}`, `${this.client.URL}/lock.png`)
      } else {
        embed.setFooter(`Version: ${data.raw.version}`)
      }

      await message.channel.send({embed});
    } catch (e) {
      if (e.toString().includes('UDP Watchdog Timeout')) {
        message.reply("The game server is offline. Please try connecting at a later date");
      } else if (e.stack.includes('ENOTFOUND')) {
        message.reply("The game server was not found. Please try again.")
      } else if (e.stack.includes('TCP Connection Refused')) {
        message.reply("The game server refused the connection. Please try again.")
      } else {
        console.log('An unidentified error has occured');
        console.log(`Error type: ${typeof e}`);
        console.log(`Error toString(): ${e.toString()}`);
        console.log(`Errormessage: ${e.message}`)
        console.log(`ErrorStack: ${e.stack}`)
      }
    }
  }
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}