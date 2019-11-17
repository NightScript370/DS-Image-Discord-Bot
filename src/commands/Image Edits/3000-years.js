import Command from '../../struct/Image-Command';
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

export default class ThreeThousandYearsCommand extends Command {
	constructor() {
		super('3000-years', {
			aliases: ['3ky', '3k-years', '3000-years'],
			category: 'Image Edits',
			description: {
				content: 'Draws a user\'s avatar over Pokémon\'s "It\'s been 3000 years" meme.'
			},
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'content'
				}
			]
		});
	}

	exec(message, { images }) {
		const __ = (k, ...v) => global.translate(authorMessage.author.lang, k, ...v)
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply(__('No images were found. Please try again.'));

		const base = loadImage(join(__dirname, '..', '..', 'assets', 'images', '3000-years.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(base, 0, 0);

		for (var image of images) {
			currentimage = loadImage(image);
			ctx.drawImage(currentimage, 461, 127, 200, 200);
		}

		const attachment = canvas.toBuffer()
		if (Buffer.byteLength(attachment) > 8e+6)
			message.util.reply(__('Resulting image was above 8 MB.'));
		else
			message.util.send(__('It has been..."a while", since you last came {0}.', message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: '3000-years.png' }] });

		return attachment;
	}
};