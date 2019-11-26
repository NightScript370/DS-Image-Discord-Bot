const Command = require('../../struct/Image-Command.js');
const createCanvas, loadImage  = require('canvas')

module.exports = class DistortCommand extends Command {
	constructor() {
		super('distort', {
			aliases: ["distort"],
			category: 'Image Edits',
			description: 'Draws an image with a distortion effect.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'level',
					type: 'integer',
					prompt: {
						start: "What level of distortion do you want to apply to the image?",
						retry: "That's not a valid level we can apply."
					}
				},
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			]
		});
	}

	async exec(message, { level, images }) {
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

		this.distort(ctx, level, 0, 0, imagessize.width, imagessize.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'distort.png' }] });
	}
};
