import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')

module.exports = class JPEGifyCommand extends Command {
	constructor() {
		super('JPEGify', {
			aliases: ["jpegify", "needs-more-jpeg", "jpeg"],
			category: 'Image Edits',
			description: 'Draws an image as a low quality JPEG.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'level',
					type: (msg, phrase) => {
						if (!phrase || isNaN(phrase)) return null;
						const num = parseFloat(phrase);
						if (num < 0.01 || num > 10) return null;
						return num;
					},
					default: 0.5
				},
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			]
		});
	}

	async exec(message, { images, level }) {
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

		const attachment = canvas.toBuffer('image/jpeg', { quality: level / 10 });
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment, name: 'image.jpg' }] });
	}
};
