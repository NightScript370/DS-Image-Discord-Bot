const Command = require('../../struct/Image-Command.js');
const createCanvas, loadImage  = require('canvas')

module.exports = class ContrastCommand extends Command {
	constructor() {
		super('contrast', {
			aliases: ["contrast"],
			category: 'Image Edits',
			description: {
				content: 'Draws an image, but with increased contrast.'
			},
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

	exec(message, { images }) {
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		const imagessize = this.largestSize(images);
		const canvas = createCanvas(imagessize.width, imagessize.height);
		const ctx = canvas.getContext('2d');

		for (var image of images) {
			currentimage = loadImage(image);

			widthpad = (imagessize.width - currentimage.width) / 2;
			heightpad = (imagessize.height - currentimage.height) / 2;

			ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
		}

		this.contrast(ctx, 0, 0, imagessize.width, imagessize.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'contrast.png' }] });
	}
};
