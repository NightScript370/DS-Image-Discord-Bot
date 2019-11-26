import Command from '../../struct/Image-Command.js';
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

export default class NintendoWiiUCommand extends Command {
	constructor() {
		super('wiiu', {
			aliases: ['wiiu', 'wii-u'],
			category: 'Covers',
			description: {
				content: 'Put an image on the Nintendo platform with barely any sales, tons of annoying kids on ads and a tablet gimick that was only properly used in 2 games.'
			},
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					description: 'These are the images for the command. This can be either attachments, user mentions, user IDs, user names, links or if the channel has an image posted beforehand within the past 50 messages: none. If you use links and/or attachments, you can even layer the image.',
					type: 'image',
					match: 'rest'
				},
				{
					id: 'nintendonetwork',
					description: 'Draw the Nintendo Network logo on the top right of the image',
					match: 'flag',
					flag: '--nintendonetwork'
				},
				{
					id: 'rating',
					type: 'gamerating',
					match: 'option',
					flag: 'rating:',
					default: null
				},
				{
					id: 'padding',
					type: 'integer',
					match: 'option',
					flag: 'padding:',
					default: 0
				},
				{
					id: 'forcestretch',
					match: 'flag',
					flag: '--forcestretch'
				},
				{
					id: 'pattern',
					type: 'image-patterns',
					match: 'option',
					flag: 'pattern:',
					default: null
				}
			]
		});
	}

	async exec(message, { images, nintendonetwork, rating, padding, forcestretch, pattern }) {
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'WiiU_Case.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		// Draw background
		/* if (pattern) {
			ctx.drawImage(pattern, 0, 0, base.width, base.height);
		} */

		for (var image of images) {
			currentimage = await loadImage(image);
			if((currentimage.width == currentimage.height || (base.height/4) > currentimage.height) && !forcestretch) {
				ctx.drawImage(currentimage, padding, (base.height / 4)+padding, base.width-padding, (base.height/1.5)-padding);
			} else if ((base.height/3) > currentimage.height && !forcestretch) {
				ctx.drawImage(currentimage, padding, (base.height / 3)+padding, base.width-padding, (base.height/2)-padding);
			} else {
				ctx.drawImage(currentimage, padding, padding, base.width-padding, base.height-padding);
			}
		}

		if (nintendonetwork) {
			let nintendonetworkImage = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'NintendoNetwork.png'));
			ctx.drawImage(nintendonetworkImage, 1368, 156, 139, 175)
		}

		if (rating)
			ctx.drawImage(rating, 35, 1890, 178, 257);

		ctx.drawImage(base, 0, 0, base.width, base.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.util.send(global.translate(message.author.lang, "{0}, Wii would like to play, with U!", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Nintendo-WiiU.png' }] });
	}
};