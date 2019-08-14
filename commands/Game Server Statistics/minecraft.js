const { Command } = require('discord-akairo');

module.exports = class MinecraftServerCommand extends Command {
  constructor() {
    super('minecraft', {
      category: 'Game Server Statistics',
      aliases: ["minecraft", "mc"],
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get stats of any Minecraft game server.',
      },
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
          description: 'Due to the many different version of minecraft, some of them are incompatible with gamedig. Therefore, we have three options for APIs: minestat (for older versions), gamedig (default) and api.mcsrvstat.us',
          type: ['minestat', 'gamedig', 'api.mcsrvstat.us'],
          match: 'option',
					flag: 'API:',
          default: 'gamedig'
        }
      ]
    });

    this.examples = ['minecraft 139.59.31.129:25565'];
  }

  async exec(message, { IP, API }) {
    IP = IP.split(':');
    let fullIP = IP.join(':');

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 25565;

    let embed = await this.client.util.embed()
      .setColor('GREEN')
      .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

    switch (API) {
      case 'minestat':
        const minestat = require('../../utils/minestat');
        minestat(host, port, function(result) {
          embed.setAuthor(`Minecraft Server Stats: ${result.address}:${result.port}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');

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
        const source = require('gamedig');
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
          embed.setAuthor(`Minecraft Server Stats: ${data.connect}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');
        }

        embed.addInline(`Players`, `${data.players.length}/${data.maxplayers}`);

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

        const { promisify } = require("util");
        const promiseRequest = promisify(request);

  		  let { body, statusCode } = promiseRequest({ url: 'https://api.mcsrvstat.us/2/'+encodeURIComponent(host), json: true })
        if (statusCode !== 200) {
          console.error(`[ERROR][Minecraft Command][api.mcsrvstat.us] statusCode: ${statusCode}`)
          return msg.reply('An error has occured replating to the API selected. Please try again with a different API, or contact the Yamamura developers');
        }

        if (!isEmpty(body.hostname)) {
          embed
            .setAuthor(`Minecraft Server Stats: ${body.hostname}`, (!isEmpty(body.icon) && body.icon.length < 2000) ? body.icon : 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
            .addInline(`Server IP`, '`'+fullIP+'`');
        } else {
          embed.setAuthor(`Minecraft Server Stats: ${fullIP}`, body.icon ? body.icon : 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');
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

        message.channel.send({embed});
        break;
      default:
        message.util.send("Not a valid API. Try again.")
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