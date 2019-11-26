import Command from '../../struct/Image-Command.js';
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

export default class BobRossCommand extends Command {
	constructor() {
		super('bob-ross', {
			aliases: ["bobross", 'bob-ross', 'ross'],
			category: "Image Edits",
			description: {
				content: "Shows an image over bob ross's canvas"
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			],
		});
	}

	exec(message, { images }) {
		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		const base = loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'bob-ross.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		ctx.rotate(0.05);

		let currentcanvas;
		for (var image of images) {
			currentcanvas = loadImage(image);
			ctx.drawImage(currentcanvas, 30, 22, 430, 400);
		}

		ctx.rotate(-0.05);
		ctx.drawImage(base, 0, 0, base.width, base.height);
		ctx.fillStyle = 'white';

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		message.util.reply(`Here's your beautiful canvas`, { files: [{ attachment, name: 'bob-ross.png' }] });
	}
}