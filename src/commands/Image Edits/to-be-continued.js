import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')
const join = require('path')

module.exports = class ToBeContinuedCommand extends Command {
	constructor() {
		super('to-be-continued', {
			aliases: ['to-be-continued', "tbc"],
			category: 'Image Edits',
			description: 'Draws an image with the "To Be Continued..." arrow.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'JoJo\'s Bizzare Adventure',
					url: 'http://www.araki-jojo.com/'
				}
			],
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

			this.drawImageWithTint(ctx, currentimage, '#704214', widthpad, heightpad, currentimage.width, currentimage.height);
		}

		const base = await loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'to-be-continued.png'));
		const ratio = base.width / base.height;
		const width = canvas.width / 2;
		const height = Math.round(width / ratio);
		ctx.drawImage(base, 0, canvas.height - height, width, height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'to-be-continued.png' }] });
	}
};