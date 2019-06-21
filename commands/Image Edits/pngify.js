const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');

module.exports = class PNGifyCommand extends Command {
	constructor() {
		super('PNGify', {
			aliases: ["pngify", "needs-more-png", "png"],
			category: 'Image Edits',
			description: 'Draws an image as a PNG. Made to convert DS Homebrew BMPs to a format viewable on Discord.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
        {
					id: 'image',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { image }) {
		let currentimage, widthpad, heightpad;

		try {
			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			for (var image of images) {
				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}

      const attachment = canvas.toBuffer('image/png');
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment, name: 'image.jpg' }] });
		} catch (err) {
      console.log(err)
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};