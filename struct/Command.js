const { Command } = require('discord-akairo');
const List = require('list-array');
const source = require('gamedig');

module.exports = class SpecialYamamuraCommand extends Command {
  constructor(id, options = {}) {
    super(id, options);
  }

  weirdUselessAnimeButEnjoyableToOthersForSomeReason (message, victim) {
    let authorname = message.guild ? message.member.displayName : message.author.username;
    Array.prototype.random = function() {
      return this[Math.floor(Math.random() * this.length)];
    };

    const messages = {
      kill: {
        solo: ["{0} decided to commit suicide. Kermit is proud of them!", "{0} decided to put an end to their existence."],
        else: ["{0} decided to put an end to {1}'s existence."],
      },
      kiss: {
        solo: ["{0} tried to kiss themselves."],
        else: ["{0} kissed {1}"],
      },
      slap: {
        solo: ["{0} is so stupid they decided to slap themselves"],
        else: ["{1} is so stupid they got slapped in the face by {0}"],
      }
    }
    
    let type = messages[message.util.parsed.alias];
    let phrases = type[message.author.id == victim.id ? "solo" : "else"];

    const images = {
      kill: {
        solo: ["{0} decided to commit suicide. Kermit is proud of them!", "{0} decided to put an end to their existence."],
        else: ["{0} decided to put an end to {1}'s existence."],
      },
      kiss: {
        solo: ["{0} tried to kiss themselves."],
        else: ["{0} kissed {1}"],
      },
      slap: {
        solo: ["{0} is so stupid they decided to slap themselves"],
        else: ["{1} is so stupid they got slapped in the face by {0}"],
      }
    }

    let returnimage = images[message.util.parsed.alias];
    let returntext = global.getString(message.author.lang, phrases.random(), "**" + authorname + "**", "**" + victim.username + "**")
    return {text: returntext};
  }

  async gameDigServer(type, IP) {
    IP = IP.split(':');
    let fullIP = IP.join(':')

    let host = IP[0];
    let port = IP[1] ? parseInt(IP[1]) : 14567;

    let data = await source.query({
      type: type,
      host: host,
      port: port
    });

    let map; 
    if (type == 'cod4') {
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

      map = `${data.map.replace('mp_', '').split('_').map(e => e.charAt(0).toUpperCase() + e.slice(1))} - ${gametype}`;
    } else if((type == 'minecraft' || type == 'minecraftbe') && this.isGood(data.raw.gametype)) {
      map = `${data.map} - ${data.raw.gametype}`;
    } else {
      map = data.map;
    }

    let embed = this.client.util.embed()
      .addField('Server IP', `\`${host}:${port}\``)
      .setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

    let hasDescription = this.isGood(this.rvMColor(data.raw.description))
    if (hasDescription) {
      if (this.isGood(this.rvMColor(data.raw.description.text)))
        embed.setDescription(this.rvMColor(data.raw.description.text))
      else if (this.isGood(this.rvMColor(data.raw.description)))
        embed.setDescription(this.rvMColor(data.raw.description))
    }

    if (hasDescription && this.isGood(map))
      embed.addField('Map', map);
    else if (!hasDescription && this.isGood(map))
      embed.setDescription(`Playing on ${map}`)

    let playersAverage = `${data.players.length}/${data.maxplayers}`;
    if (data.players.length) {
      let players = [];
      let scores = [];
      let pings = [];
      let playtime = [];

      for (var player of data.players) {
        players.push(player.name);

        if (player.frags)
          scores.push(player.frags);
        else if (player.score)
          scores.push(player.score);

        if (player.ping)
          pings.push(`${player.ping}ms`);
        else if (player.playtime)
          playtimes.push(`${parseInt(player.time)}s`);
      }

      embed
        .addInline('Players', playersAverage + '\n```http\n'+players.join('\n')+'```')
        .addInline('Score', '​\n```http\n'+scores.join('\n')+'```');

      if (pings.length)
        embed.addInline('Ping', '​\n```http\n'+pings.join('\n')+'```');
      else if (playtime.length)
        embed.addInline('Playtime', '​\n```http\n'+playtimes.join('\n')+'```');

      if (type !== 'cod4')
        embed.addField('Join', `<steam://connect/${host}:${port}>`)
      else
        embed.addField('Join', `<cod4://${host}:${port}>`)
    } else 
      embed.addInline('Players', playersAverage)

    let footerArgs = [];
    if (data.password)
      footerArgs.push('Private Server');

    if (this.isGood(data.raw.version)) {
      if (this.isGood(data.raw.version.name))
        footerArgs.push(`Version: ${data.raw.version.name}`)
      else
        footerArgs.push(`Version: ${data.raw.version}`)
    }

    if (this.isGood(data.raw.uptime))
      footerArgs.push(`Uptime: ${data.raw.uptime}`);

    if (data.password)
      embed.setFooter(footerArgs.join(" • "), `${this.client.website.URL}/lock.png`);
    else
      embed.setFooter(footerArgs.join(" • "));

    return {embed, data};
  }

  rvMColor(motd) {
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

  async responceSelector(msg, responces, embed) {
    let WaitMessage = global.getString(msg.author.lang,
                                        "Within the next 30 seconds, you'll need to pick a number between 1-{0}. "
                                      + "The command will be automatically canceled canceled in 30 seconds if no selection has been made."
                                      + "Alternatively, type `cancel` to manually cancel the command, skipping the countdown",
                                       responces.length)

    switch(responces.length) {
      case 0:
        embed
					.setDescription(`There have been no results found for your search query. Try using a different name.`)
					.setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL({format: 'png'}))
					.setTimestamp(new Date());

				msg.util.send(embed);
        return null
				break;
      case 1:
        return responces[0];
        break;
      case 2:
      case 4:
      case 6:
      case 8:
        embed
          .setDescription(global.getString(msg.author.lang, "Requested by {0}", msg.author.tag))
					.setFooter(WaitMessage)
					.setTimestamp(new Date());

				for (var i in responces) {
          if (isNaN(i)) continue;

          embed = await this.handleSelector(responces, i, await embed, msg.author.lang)
				}

				msg.channel.send(embed);
        break;
      default:
        let resp = '';
        let whattoadd;
				for (var i in responces) {
          if (isNaN(i)) continue;

          whattoadd = await this.handleSelector(responces, i, null, msg.author.lang)
          console.log(whattoadd)
          resp += whattoadd
				}

        resp += `\n` + WaitMessage;
				embed
					.setColor("#FF006E")
					.setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL({format: 'png'}))
					.setTimestamp(new Date())
					.setDescription(resp);
				msg.channel.send(embed);
    }

    let filter = response => response.author.id == msg.author.id && (!isNaN(response.content) && parseInt(response.content) <= responces.length && parseInt(response.content) > 0 || response.content == 'cancel');
    try {
      let collected = await msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })

			if(collected.first().content == 'cancel') {
        msg.reply('command canceled');
        return null
      }
		  
      return await responces[collected.first().content - 1]
    } catch (e) {
      msg.reply('command canceled');
      return null
    }
  }

  isGood(variable) {
    if (variable && variable !== null && (variable.size || variable.length)) return true;
    return false;
  }
}