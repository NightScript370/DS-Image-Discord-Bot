import Command from '../../struct/Image-Command.js';
import canvas from 'canvas';
const { createCanvas, loadImage } = canvas

export default class PNGifyCommand extends Command {
	constructor() {
		super('PNGify', {
			aliases: ["pngify", "needs-more-png", "png"],
			category: 'Image Edits',
			description: 'Draws an image as a PNG. Made to convert BMPs to a format viewable on Discord.',
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
		const canvas = await createCanvas(imagessize.width, imagessize.height);
		const ctx = canvas.getContext('2d');

		for (var image of images) {
			currentimage = await loadImage(image);

			widthpad = (imagessize.width - currentimage.width) / 2;
			heightpad = (imagessize.height - currentimage.height) / 2;

			ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
		}

		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment, name: 'image.png' }] });
	}
};
