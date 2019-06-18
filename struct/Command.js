const { Command } = require('discord-akairo');
const List = require('list-array');

class CustomCommand extends Command {
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

  sendInChannelOrDM(msg, responce, options=null) {
    let msgresponce;
    if (!responce.dm && !responce.guild) {
      msgresponce = responce;
    } else {
      
    }
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
}

module.exports = CustomCommand;