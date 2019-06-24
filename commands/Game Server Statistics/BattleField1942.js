const { Command } = require('discord-akairo');
const source = require('gamedig');

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
    let embed = this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 14567;

    try {
      let data = await source.query({
        type: 'bf1942',
        host: host,
        port: port
      });

      embed
        .setColor("BLUE")
        .setTitle(data.name)
        .setDescription('[Battlefield: 1942](https://www.battlefield.com/games/battlefield-1942)')
        .addInline('Server IP', `\`${host}:${port}\``)
        .addInline('Players', `${data.players.length}/${data.maxplayers}`)
        .addField('Map', data.map)
        .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

      if (data.players.length) {
        let players = [];
        let scores = [];
        let pings = [];
        for (var player of data.players) {
          players.push(player.name);
          scores.push(player.frags);
          pings.push(`${player.ping}ms`);
        }

        embed
          .addInline('Player', '```http'+players.join('\n')+'```')
          .addInline('Score', '```http\n'+scores.join('\n')+'```')
          .addInline('Ping', '```http\n'+pings.join('\n')+'```')
          .addField('Join', `<steam://connect/${host}:${port}>`)
      } 

      if (data.password) {
        embed.setFooter(`Private Server`, `${this.client.URL}/lock.png`)
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