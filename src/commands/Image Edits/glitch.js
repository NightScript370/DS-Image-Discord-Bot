import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')

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

	async exec(message, { images }) {
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		const imagessize = await this.largestSize(images);
		const canvas = createCanvas(imagessize.width, imagessize.height);
		const ctx = canvas.getContext('2d');

		for (var image of images) {
			currentimage = await loadImage(image);

			widthpad = (imagessize.width - currentimage.width) / 2;
			heightpad = (imagessize.height - currentimage.height) / 2;

			ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
		}

		this.distort(ctx, 20, 0, 0, imagessize.width, imagessize.height, 5);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'distort.png' }] });
	}
};
