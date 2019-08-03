const { Command } = require('discord-akairo');
const source = require('gamedig');
const minestat = require('../../utils/minestat');

module.exports = class MinecraftServerCommand extends Command {
  constructor() {
    super('minecraft', {
      category: 'Game Server Statistics',
      aliases: ["minecraft", "mc"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any Minecraft game server.',
      args: [
        {
          id: 'IP',
          prompt: {
              start: 'Which minecraft server would you like to get stats from?',
              retry: 'That\'s not a server we can get stats from! Try again.'
          },
          type: 'string'
        },
        {
          id: 'API',
          match: 'option',
					flag: 'API:',
          default: 'gamedig'
        }
      ]
    });

    this.examples = ['minecraft 139.59.31.129:25565'];
  }

  async exec(message, { IP, API }) {
    let embed = await this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':');

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 25565;

    try {
      switch (API) {
        case 'minestat':
          minestat(host, port, function(result) {
            embed
              .setAuthor(`Minecraft Server Stats: ${result.address}:${result.port}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
              .setColor(`GREEN`)
              .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png');

            if(result.online) {
              embed
                .setDescription(`:large_blue_circle: Server is online.`)
                .setFooter(`Players: ${result.current_players}/${result.max_players}`);
              
              if (!isEmpty(removeMinecraftColor(result.motd))) {
                embed.addField("Message of the Day", removeMinecraftColor(result.motd));
              }
            } else {
              embed.setDescription(`:red_circle: Server is offline`);
            }

            message.channel.send({embed});
          });
          break;
        case 'gamedig':
          let data = await source.query({
            type: 'minecraft',
            host: host,
            port: port
          });

          if (!isEmpty(data.name)) {
            embed
              .setAuthor(`Minecraft Server Stats: ${data.name}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
              .addInline(`Server`, `\`${data.connect}\``);
          } else {
            embed
              .setAuthor(`Minecraft Server Stats: ${data.connect}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');
          }

          embed
            .setColor(`GREEN`)
            .addInline(`Players`, `${data.players.length}/${data.maxplayers}`)
            .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png');

          if (!isEmpty(removeMinecraftColor(data.raw.description.text))) {
            embed.setDescription(removeMinecraftColor(data.raw.description.text));
          }

          if (!isEmpty(data.raw.map))      embed.addInline('Map', data.raw.map);
          if (!isEmpty(data.raw.gametype)) embed.addInline(`Gametype`, data.raw.gametype);

          if (data.password) {
            if (!isEmpty(data.raw.version.name)) embed.setFooter(`Private Server • Version: ${data.raw.version.name}`, `${this.client.URL}/lock.png`);
            else if (!isEmpty(data.raw.version)) embed.setFooter(`Private Server • Version: ${data.raw.version}`, `${this.client.URL}/lock.png`);
          } else {
            if (!isEmpty(data.raw.version.name)) embed.setFooter(`Version: ${data.raw.version.name}`);
            else if (!isEmpty(data.raw.version)) embed.setFooter(`Version: ${data.raw.version}`);
          }

          await message.channel.send({embed});
          break;
        case 'api.mcsrvstat.us':
          const request = require("request");
    		  request({ url: 'https://api.mcsrvstat.us/2/'+encodeURIComponent(host), json: true }, function (error, response, body) {
			      if (!error && response.statusCode === 200) {
              if (!isEmpty(body.hostname)) {
                embed
                  .setAuthor(`Minecraft Server Stats: ${body.hostname}`, (!isEmpty(body.icon) && body.icon.length < 2000) ? body.icon : 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
                  .addInline(`Server IP`, '`'+fullIP+'`');
              } else {
                embed
                  .setAuthor(`Minecraft Server Stats: ${fullIP}`, body.icon ? body.icon : 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');
              }

              if (!isEmpty(body.motd)) {
                embed.setDescription(body.motd.clean);
              }

              if (!isEmpty(body.players)) {
                let players = `${body.players.online}/${body.players.max}`;
                if (!isEmpty(body.players.list)) {
                  players += '\n```http\n'+body.players.list.join('\n')+'```';
                }
                embed.addField("Players", players);
              }

              embed
                .setColor('GREEN')
                .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png');

              message.channel.send({embed});
            } else {
              console.log(error);
    			  }
		      });
          break;
        default:
          message.util.send("Not a valid API. Try again.")
      }
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

function removeMinecraftColor(motd) {
  if (!motd) return '';

  return motd
    .split('§0').join('')
    .split('§1').join('')
    .split('§2').join('')
    .split('§3').join('')
    .split('§4').join('')
    .split('§5').join('')
    .split('§6').join('')
    .split('§7').join('')
    .split('§8').join('')
    .split('§9').join('')
    .split('§a').join('')
    .split('§b').join('')
    .split('§c').join('')
    .split('§d').join('')
    .split('§e').join('')
    .split('§f').join('')
}