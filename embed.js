const djs = require('discord.js')
const client = require('./yamamura.js')

module.exports = class Embed extends djs.MessageEmbed {
	constructor(...args) {
		super(args)
	}

  setColor(color) {
    switch (color) {
      case 'thanos':
        return super.setColor(0x71368A);
        // Break not needed when you return
      case 'DARK_MODE_INVISIBLE':
        return super.setColor(0x36393F);
      default:
        return super.setColor(color);
    }
  }

    /**
   * Resets an embed.
   * @param {Object} [options] Which areas to reset on the embed
   * @returns {MessageEmbed}
   */
  reset(options) {
    if (!options) {
      options = {
        type: true,
        title: true,
        description: true,
        url: true,
        color: true,
        timestamp: true,
        fields: true,
        thumbnail: true,
        image: true,
        video: true,
        author: true,
        provider: true,
        footer: true,
        files: true,
      };
    }

    if (options.type) this.type = undefined;
    if (options.title) this.title = undefined;
    if (options.description) this.description = undefined;
    if (options.url) this.url = undefined;
    if (options.color) this.color = undefined;
    if (options.timestamp) this.timestamp = undefined;
    if (options.fields) this.fields = undefined;
    if (options.thumbnail) this.thumbnail = undefined;
    if (options.image) this.image = undefined;
    if (options.video) this.video = undefined;
    if (options.author) this.author = undefined;
    if (options.provider) this.provider = undefined;
    if (options.footer) this.footer = undefined;
    if (options.files) this.files = undefined;

    return this;
  }

  addInline(title, desc) {
		return super.addField(title, desc, true)
	}

	setTitle(title, url) {
		return super.setTitle(title).setURL(url)
	}

	setYamamuraCredits(icon = true) {
    try {
		  if (icon == true) {
			  return super.setFooter(client.user.username + " - by NightYoshi370 & Samplasion", client.user.displayAvatarURL({format: 'png'}));
		  } else {
			  return super.setFooter(client.user.username + " - by NightYoshi370 & Samplasion");
		  }
    } catch(e) {
      return super.setFooter("Yamamura - by NightYoshi370 & Samplasion")
    }
	}

	setServerFooter(msg, icon) {
		try {
      if (icon == true) {
			  return super.setFooter(msg.guild.name, msg.guild.iconURL({format: 'png'}))
		  } else {
			  return super.setFooter(msg.guild.name)
		  }
    } catch(e) {
      console.error(e);
      console.log(msg);
    }
	}
}