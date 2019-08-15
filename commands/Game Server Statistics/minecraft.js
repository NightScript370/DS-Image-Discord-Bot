const Command = require('../../struct/Command');
const { promisify } = require("util");

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

    let MineEmbed = await this.client.util.embed()
      .setColor('GREEN')
      .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

    switch (API) {
      case 'minestat':
        const minestat = require('../../utils/minestat');
        const promiseMinestat = promisify(minestat)

        let result = await minestat(host, port);

        MineEmbed
          .setAuthor(`Minecraft Server Stats: ${result.address}:${result.port}`, 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');

        if(result.online) {
          MineEmbed
            .setDescription(`:large_blue_circle: Server is online.`)
            .setFooter(`Players: ${result.current_players}/${result.max_players}`);

          if (!isEmpty(removeMinecraftColor(result.motd))) {
            MineEmbed.addField("Message of the Day", removeMinecraftColor(result.motd));
          }
        } else {
          MineEmbed.setDescription(`:red_circle: Server is offline`);
        }

        message.channel.send({MineEmbed});
        break;
      case 'gamedig':
        let { embed, data } = await this.gameDigServer('minecraft', IP);
        embed.setColor('GREEN')

        message.util.reply(`Information on the "${data.name}" Minecraft (Java Edition) server` + message.guild ? `, requested by ${message.member.displayName}` : '', {embed});
        break;
      case 'api.mcsrvstat.us':
        const request = require("request");
        const promiseRequest = promisify(request);

  		  let { body, statusCode } = await promiseRequest({ url: 'https://api.mcsrvstat.us/2/'+encodeURIComponent(host), json: true })
        if (statusCode !== 200) {
          console.error(`[ERROR][Minecraft Command][api.mcsrvstat.us] statusCode: ${statusCode}`)
          return msg.reply('An error has occured replating to the API selected. Please try again with a different API, or contact the Yamamura developers');
        }

        if (!isEmpty(body.hostname)) {
          MineEmbed
            .setAuthor(`Minecraft Server Stats: ${body.hostname}`, (!isEmpty(body.icon) && body.icon.length < 2000) ? body.icon : 'http://www.rw-designer.com/icon-image/5547-256x256x32.png')
            .addInline(`Server IP`, '`'+fullIP+'`');
        } else {
          MineEmbed.setAuthor(`Minecraft Server Stats: ${fullIP}`, body.icon ? body.icon : 'http://www.rw-designer.com/icon-image/5547-256x256x32.png');
        }

        if (!isEmpty(body.motd)) {
          MineEmbed.setDescription(body.motd.clean);
        }

        if (!isEmpty(body.players)) {
          let players = `${body.players.online}/${body.players.max}`;
          if (!isEmpty(body.players.list)) {
            players += '\n```http\n'+body.players.list.join('\n')+'```';
          }
          MineEmbed.addField("Players", players);
        }

        message.channel.send({MineEmbed});
        break;
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