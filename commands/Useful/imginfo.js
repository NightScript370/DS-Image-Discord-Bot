const { Command } = require('discord-akairo');
const { loadImage } = require('canvas');

module.exports = class ImgInfoCommand extends Command {
	constructor() {
		super('imginfo', {
			aliases: ["imginfo"],
			category: 'Useful',
			description: {
        content: 'Displays information on an image.'
      },
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['EMBED_LINKS'],
			args: [
        {
					id: 'image',
					type: 'image',
				}
			]
		});
	}

	async exec(msg, { image }) {
		try {
			const data = await loadImage(image);
      
      let filenameSplit = image.split(/[#?]/)[0].split("/");
      let ext = filenameSplit[filenameSplit.length-1].split(".")[1]
      
      let ImageInfoEmbed = this.client.util.embed()
        .setColor("BLUE")
        .addInline(global.getString(msg.author.lang, "Format"), `\`.${ext}\``)
        .addInline(global.getString(msg.author.lang, "Dimentions"),
                      `**${global.getString(msg.author.lang, "Width")}**: ${global.getString(msg.author.lang, "{0} pixels", data.width)} \n`
                    + `**${global.getString(msg.author.lang, "Height")}**: ${global.getString(msg.author.lang, "{0} pixels", data.height)}`
        )
        .setImage(image)
        .setFooter(global.getString(msg.author.lang, "Image information requested by {0}", msg.author.tag))
			return msg.util.send({ embed: ImageInfoEmbed });
		} catch (err) {
      console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};