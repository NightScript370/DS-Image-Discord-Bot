const { Command } = require('discord-akairo');
const source = require('gamedig');

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
    let embed = this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 28015;

    try {
      let data = await source.query({
        type: 'rust',
        host: host,
        port: port
      });

      embed
        .setColor("BLUE")
        .setTitle(data.name)
        .setDescription('[Rust](https://store.steampowered.com/app/252490/)')
        .addInline('Server IP', `\`${host}:${port}\``)
        .addInline('Players', `${data.players.length}/${data.maxplayers}`)
        .addField('Map', data.map)
        .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

      if (data.players.length) {
        let players = [];
        let scores = [];
        let playtimes = [];
        for (var player of data.players) {
          players.push(player.name);
          scores.push(player.frags);
          playtimes.push(`${parseInt(player.time)}s`);
        }

        embed
          .addInline('Player', `\`\`\`http\n${players.join('\n')}\`\`\``)
          .addInline('Score', '```http\n'+scores.join('\n')+'```')
          .addInline('PlayTime', '```http\n'+playtimes.join('\n')+'```')
          .addField('Join', `<steam://connect/${host}:${port}>`)
      }

      if (data.password) {
        embed.setFooter(`Private Server`, 'https://resources.bastionbot.org/images/lock.png')
      }

      message.channel.send({embed});
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