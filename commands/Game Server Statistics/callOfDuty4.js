const { Command } = require('discord-akairo');
const source = require('gamedig');

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
              start: 'Which server would you like to get COD4 stats from?',
              retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP',
        match: 'content'
      }]
    });

    this.examples = ['callOfDuty4 139.59.31.128:27016'];
  }

  async exec(message, { IP }) {
    let embed = this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 28960;

    try {
      let data = await source.query({
        type: 'cod4',
        host: host,
        port: port
      });
    
      let gametypes = {
        war: 'Team Deathmatch',
        dm: 'Free for All',
        sd: 'Search and Destroy',
        dom: 'Domination',
        koth: 'Headquarters',
        sab: 'Sabotage'
      };

      let gametype;
      if (gametypes.hasOwnProperty(data.raw.g_gametype)) {
        gametype = gametypes[data.raw.g_gametype];
      } else {
        gametype = data.raw.g_gametype;
      }

      embed
        .setColor("BLUE")
        .setTitle(data.name)
        .setDescription('[Call of Duty 4®: Modern Warfare®](https://store.steampowered.com/app/7940)')
        .addInline('Server IP', `\`${host}:${port}\``)
        .addInline('Players', `${data.players.length}/${data.maxplayers}`)
        .addField('Map/Gametype', `${data.map.replace('mp_', '').split('_').map(e => e.charAt(0).toUpperCase() + e.slice(1))} - ${gametype}`)
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
          .addInline('Player', `\`\`\`http\n${players.join('\n')}\`\`\``)
          .addInline('Score', `\`\`\`http\n${scores.join('\n')}\`\`\``)
          .addInline('Ping', `\`\`\`http\n${pings.join('\n')}\`\`\``)
          .addField('Join', `<cod4://${host}:${port}>`)
      }

      if (data.password) {
        embed.setFooter(`Private Server • Uptime: ${data.raw.uptime}`, 'https://resources.bastionbot.org/images/lock.png')
      } else {
        embed.setFooter(`Server Uptime: ${data.raw.uptime}`)
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