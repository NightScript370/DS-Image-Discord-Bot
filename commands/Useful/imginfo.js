const Command = require('../../struct/Image-Command');
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
					id: 'images',
					type: 'image',
				}
			]
		});
	}

	async exec(msg, { images }) {
		let currentimage, widthpad, heightpad;
		try {
			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			var ext;
			if (typeof images == "string" || (images instanceof Array && images.length == 1)) {
	      let filenameSplit = (images instanceof Array ? images[0] : images).split(/[#?]/)[0].split("/");
	      ext = filenameSplit[filenameSplit.length-1].split(".")[1]
			} else {
				// The buffer would be created in PNG anyway
				ext = "png";
			}

			for (var image of images) {
				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}

      let ImageInfoEmbed = this.client.util.embed()
        .setColor("BLUE")
        .addInline(global.getString(msg.author.lang, "Format"), `\`.${ext}\``)
        .addInline(global.getString(msg.author.lang, "Dimentions"),
                      `**${global.getString(msg.author.lang, "Width")}**: ${global.getString(msg.author.lang, "{0} pixels", ctx.width)} \n`
                    + `**${global.getString(msg.author.lang, "Height")}**: ${global.getString(msg.author.lang, "{0} pixels", ctx.height)}`
        )
        .setFooter(global.getString(msg.author.lang, "Image information requested by {0}", msg.author.tag))

				// Avoids an "error" in which you can only add URLs to embed images
				if (typeof images == "string" || (images instanceof Array && images.length == 1))
        	ImageInfoEmbed.setImage(images instanceof Array ? images[0] : images)

			return msg.util.send({ embed: ImageInfoEmbed });
		} catch (err) {
      console.error(err);
			return msg.reply(global.getString(msg.author.lang, "Oh no, an error occurred: `{0}`. Try again later!", err.message));
		}
	}
};
