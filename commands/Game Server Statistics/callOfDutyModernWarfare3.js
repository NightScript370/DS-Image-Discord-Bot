const { Command } = require('discord-akairo');
const source = require('gamedig');

module.exports = class COD4Command extends Command {
  constructor() {
    super('callOfDutyModernWarfare3', {
      category: 'Game Server Statistics',
      aliases: ["callOfDutyModernWarfare3", "codmw3"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any Call of Duty: Modern Warfare 3 game server.',
      args: [{
        id: 'IP',
        prompt: {
              start: 'Which server would you like to get `Call of Duty: Modern Warfare 3` statistics from?',
              retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP'
      }]
    });

    this.examples = ['callOfDutyModernWarfare3 139.59.31.129:27019'];
  }

  async exec(message, { IP }) {
    let embed = this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 27015;

    try {
      let data = await source.query({
        type: 'codmw3',
        host: host,
        port: port
      });

      embed
        .setColor("BLUE")
        .setTitle(data.name)
        .setDescription('[Call of Duty: Modern Warfare 3](https://store.steampowered.com/app/42690/)')
        .addInline('Server IP', `\`${host}:${port}\``)
        .addInline('Players', `${data.players.length}/${data.maxplayers}`)
        .addField('Map', data.map)
        .setThumbnail('http://icons.iconarchive.com/icons/3xhumed/call-of-duty-modern-warfare-3/512/CoD-Modern-Warfare-3-1a-icon.png')
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
          .addInline('Player', '````http\n'+players.join('\n')+'```')
          .addInline('Score', '```http\n'+scores.join('\n')+'```')
          .addInline('Ping', '```http\n'+pings.join('\n')+'```')
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