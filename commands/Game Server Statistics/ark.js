const { Command } = require('discord-akairo');
const source = require('gamedig');

const { loadImage, createCanvas } = require('canvas');
const path = require('path');

module.exports = class ARKCommand extends Command {
  constructor() {
    super('ark', {
      category: 'Game Server Statistics',
      aliases: ["ark", "arkse"],
      clientPermissions: ['EMBED_LINKS'],
      description: 'Get stats of any ARK: Survival Evolved game server.',
      args: [{
        id: 'IP',
        prompt: {
              start: 'Which server would you like to get `ARK: Survival Evolved` statistics from?',
              retry: 'That\'s not a server we can get stats from! Try again.'
        },
        type: 'externalIP'
      }]
    });

    this.examples = ['ark 139.59.31.129:27019'];
  }

  async exec(message, { IP }) {
    let embed = this.client.util.embed()

    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 27015;

    console.log(host, port, IP, fullIP)
    try {
      let data = await source.query({
        type: 'arkse',
        host: host,
        port: port
      });

      const gameTrackerLink = 'https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png'

      embed
        .setColor("BLUE")
        .setTitle(data.name)
        .setDescription('[ARK: Survival Evolved](https://store.steampowered.com/app/346110/)')
        .addInline('Server IP', `\`${fullIP}\``)
        .addInline('Players', `${data.players.length}/${data.maxplayers}`)
        .addField('Map', data.map)

      if (data.players.length) {
        let players = [];
        let scores = [];
        let playtimes = [];
        for (var player of data.players) {
          players.push(player.name);
          scores.push(player.score);
          if (player.time !== 'NaN' && player.time !== undefined)
            playtimes.push(`${parseInt(player.time)}s`);
        }

        embed
          .addInline('Player', '```http\n'+players.join('\n')+'```')
          .addInline('Score', '```http\n'+scores.join('\n')+'```')
          .addInline('Playtime', '```http\n'+playtimes.join('\n')+'```')
          .addField('Join', `<steam://connect/${host}:${port}>`)
      }

      if (data.password) {
        embed.setFooter(`Private Server`, 'https://resources.bastionbot.org/images/lock.png')
      }

      try {
        const localNonExist = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'gameserverstat', 'ark_nonexistant.png'));
        const localBase64 = this.getBase64Image(localNonExist);

        const gameTrackerImage = await loadImage(gameTrackerLink);
        const gameTrackerBase64 = this.getBase64Image(gameTrackerImage);

        if(gameTrackerBase64 !== localBase64)
          embed.setImage(gameTrackerLink)
      } catch(e) {
        console.log(e)
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
        message.reply("Unknown error occured.")
        console.log('An unidentified error has occured');
        console.log(`Error type: ${typeof e}`);
        console.log(`Error toString(): ${e.toString()}`);
        console.log(`Errormessage: ${e.message}`)
        console.log(`ErrorStack: ${e.stack}`)
      }
    }
  }
  
  getBase64Image(image) {
    let canvas = createCanvas(image.width, image.height);
		let ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);
    return canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
  } 
};