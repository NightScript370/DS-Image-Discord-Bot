const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const { distort } = require('../../utils/Canvas');

module.exports = class GlitchCommand extends Command {
	constructor() {
		super('glitch', {
			aliases: ["glitch"],
			category: 'Image Edits',
			description: 'Draws an image with a glitch effect.',
      		cooldown: 10000,
      		ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
        		{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			]
		});
	}

	async exec(msg, { images }) {
		let currentimage, widthpad, heightpad;

		try {
			const imagessize = await this.largestSize(images);
			const canvas = createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			for (var image of images) {
				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}

			distort(ctx, 20, 0, 0, imagessize.width, imagessize.height, 5);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'distort.png' }] });
		} catch (err) {
			console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
