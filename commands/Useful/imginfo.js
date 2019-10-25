const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');

module.exports = class ImgInfoCommand extends Command {
	constructor() {
		super('imginfo', {
			aliases: ["imginfo"],
			category: 'Useful',
			description: {
				content: 'Displays information on either an entire image or individual layers.'
			},
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				},
				{
					id: 'perlayerView',
					match: 'flag',
					flag: '--separate'
				}
			]
		});
	}

	async exec(msg, { images, perlayerView }) {
		let currentimage, widthpad, heightpad, fielddescription;

		if (!this.isGood(images))
			return msg.reply('No images were found. Please try again.')

		if (perlayerView && images instanceof Array && images.length > 8)
			return msg.reply('Up to 20 layers may be viewed individually');

		try {
			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			let ImageInfoEmbed = this.client.util.embed()
				.setColor("BLUE")
				.setFooter(global.translate(msg.author.lang, "Image information requested by {0}", msg.author.tag), msg.author.displayAvatarURL());

			if (typeof images == "string" || (images instanceof Array && images.length == 1)) {
				ImageInfoEmbed
					.setImage(images instanceof Array ? images[0] : images)
					.addInline("Format Extention", this.getExtention(images instanceof Array ? images[0] : images))
					.addInline(global.translate(msg.author.lang, "Dimentions"),
					  `**${global.translate(msg.author.lang, "Width")}**: ${global.translate(msg.author.lang, "{0} pixels", imagessize.width)} \n`
					+ `**${global.translate(msg.author.lang, "Height")}**: ${global.translate(msg.author.lang, "{0} pixels", imagessize.height)}`);
			} else {
				let layerList = "";
				for (var image of images) {
					if(layerList.length < 1000) {
						layerList += image + '\n';
					}

					currentimage = await loadImage(image);

					widthpad = (imagessize.width - currentimage.width) / 2;
					heightpad = (imagessize.height - currentimage.height) / 2;

					ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
				}

				ImageInfoEmbed
					.attachFiles([{name: "image.png", attachment: canvas.toBuffer()}])
					.setImage('attachment://image.png')
					.addField(`Layers (${images.length})`, layerList);

				if (perlayerView) {
					for (var index in images) {
						currentimage = await loadImage(images[index]);

						fielddescription = '';
						fielddescription += `**Format:** ${this.getExtention(images[index])} \n`;
						fielddescription += `**${global.translate(msg.author.lang, "Width")}**: ${global.translate(msg.author.lang, "{0} pixels", currentimage.width)} \n`;
						fielddescription += `**${global.translate(msg.author.lang, "Height")}**: ${global.translate(msg.author.lang, "{0} pixels", currentimage.height)} \n`;
						fielddescription += `**Link to image:** ${images[index]}`;

						ImageInfoEmbed.addField(`Layer #(${images[index]})`, fielddescription);
					}
				} else {
					ImageInfoEmbed.addInline(global.translate(msg.author.lang, "Dimentions"),
					  `**${global.translate(msg.author.lang, "Width")}**: ${global.translate(msg.author.lang, "{0} pixels", imagessize.width)} \n`
					+ `**${global.translate(msg.author.lang, "Height")}**: ${global.translate(msg.author.lang, "{0} pixels", imagessize.height)}`);
				}
			}

			return msg.util.send({ embed: ImageInfoEmbed });
		} catch (err) {
			console.error(err);
			return msg.reply(global.translate(msg.author.lang, "Oh no, an error occurred: `{0}`. Please report your error to the Yamamura developers!", err.message));
		}
	}

	getExtention(link) {
		let filenameSplit = link.split(/[#?]/)[0].split("/");
		return filenameSplit[filenameSplit.length-1].split(".")[1];
	}
};
