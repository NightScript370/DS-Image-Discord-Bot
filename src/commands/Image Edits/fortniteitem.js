import Command from '../../struct/Image-Command.js';
import canvas from 'canvas';
const { createCanvas, loadImage } = canvas
import { join, resolve } from 'path';

export default class FortniteItemCommand extends Command {
	constructor() {
		super('fortniteitem', {
			aliases: ['fortniteitem'],
			category: 'Image Edits',
			description: 'Draws a new fortnite item of your choice.',
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
		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		const base = await loadImage(join(resolve(), '..', '..', '..', 'assets', 'images', 'fortniteitem.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		let currentitem;
		for (var image of images) {
			currentitem = await loadImage(image);
			ctx.drawImage(currentitem, 60, 43, 165, 165);
		}

		ctx.drawImage(base, 0, 0)

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'fortniteitem.png' }] });
	}
};