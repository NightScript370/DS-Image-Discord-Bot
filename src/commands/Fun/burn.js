import Command from '../../struct/Image-Command.js';
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

export default class BurnCommand extends Command {
	constructor() {
		super('burn', {
			aliases: ["fire", "hell", "burn"],
			category: 'Fun',
			description: 'Draws an image with a destructive fire effect.',
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

			this.drawImageWithTint(ctx, currentimage, '#fc671e', widthpad, heightpad, currentimage.width, currentimage.height);
		}

		const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'fire.png'));
		ctx.drawImage(base, 0, 0, imagessize.width, imagessize.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.channel.send({ files: [{ attachment: attachment, name: 'fire.png' }] });
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}