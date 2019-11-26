import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')

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
		const __ = (k, ...v) => global.translate(msg.author.lang, k, ...v);

		if (!this.isGood(images))
			return msg.util.reply(__('No images were found. Please try again.'))

		if (perlayerView && images instanceof Array && images.length > 8)
			return msg.util.reply(__('Up to 20 layers may be viewed individually'));

		const imagessize = await this.largestSize(images);
		const canvas = await createCanvas(imagessize.width, imagessize.height);
		const ctx = canvas.getContext('2d');

		let ImageInfoEmbed = this.client.util.embed()
			.setColor("BLUE")
			.setFooter(__("Image information requested by {0}", msg.author.tag), msg.author.displayAvatarURL());

		if (typeof images == "string" || (images instanceof Array && images.length == 1)) {
			ImageInfoEmbed
				.setImage(images instanceof Array ? images[0] : images)
				.addInline(__("Format Extention"), this.getExtention(images instanceof Array ? images[0] : images))
				.addInline(__("Dimentions"), `**${__("Width")}**: ${__("{0} pixels", imagessize.width)} \n`
										   + `**${__("Height")}**: ${__("{0} pixels", imagessize.height)}`);
		} else {
			let layerList = "";
			for (var image of images) {
				if (layerList.length < 1000)
					layerList += image + '\n';

				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}

			ImageInfoEmbed
				.attachFiles([{name: "image.png", attachment: canvas.toBuffer()}])
				.setImage('attachment://image.png')
				.addField(__("Layers ({0})", images.length), layerList);

			if (perlayerView) {
				for (var index in images) {
					currentimage = await loadImage(images[index]);
					ImageInfoEmbed.addField(__("Layer #{0}", index), `**Format:** ${this.getExtention(images[index])}\n\n`
																   + `**${__("Width")}**: ${__("{0} pixels", currentimage.width)}\n`
																   + `**${__("Height")}**: ${__("{0} pixels", currentimage.height)}\n\n`
																   + `**Link to image:** ${images[index]}`);
				}
			} else
				ImageInfoEmbed.addInline(__("Dimentions"), `**${__("Width")}**: ${__("{0} pixels", imagessize.width)}\n`
														 + `**${__("Height")}**: ${__("{0} pixels", imagessize.height)}`);
		}

		return msg.util.send({ embed: ImageInfoEmbed });
	}

	getExtention(link) {
		let filenameSplit = link.split(/[#?]/)[0].split("/");
		return filenameSplit[filenameSplit.length-1].split(".")[1];
	}
};
