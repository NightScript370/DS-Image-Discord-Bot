import Command from '../../struct/Image-Command.js';
import * as canvas from 'canvas';
const { createCanvas, loadImage } = canvas
import { join } from 'path';

export default class NintendoDSCommand extends Command {
	constructor() {
		super('ds', {
			aliases: ['ds'],
			category: 'Covers',
			description: {
				content: "Put an image on the cover for the handheld with two screens that somehow beat Sony",
				examples: ["ds @NightScript"]
			},
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					description: 'These are the images for the command. This can be either attachments, user mentions, user IDs, user names, links or if the channel has an image posted beforehand within the past 50 messages: none. If you use multiple links and/or attachments, you can even layer the image.',
					type: 'image',
					match: 'rest'
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
					default: 5
				},
				{
					id: 'internet',
					match: 'flag',
					flag: '--internet'
				},
				{
					id: 'funky',
					match: 'flag',
					flag: '--funky'
				},
				{
					id: 'pattern',
					match: 'option',
					flag: 'pattern:',
					type: 'image-patterns',
					default: null
				}
			]
		});
	}

	async exec(message, { images, rating, padding, internet, funky, pattern }) {
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'ds', 'DS_Case.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		// Draw background
		//if (pattern)
			//ctx.drawImage(pattern, 0, 0, base.width, base.height);

		for (var image of images) {
			currentimage = await loadImage(image);
			await ctx.drawImage(currentimage, 104+padding, 17+padding, 672-padding, 697-padding);
		}

		// if (rating)
			// await ctx.drawImage(rating, 0, 0, base.width, base.height);

		if (funky) {
			let funkyImg = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'funkymode.png'));
			await ctx.drawImage(funkyImg, 455, 18, 321, 193);
		}

		await ctx.drawImage(base, 0, 0, base.width, base.height);

		if (internet) {
			let internetImg = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'ds', 'wfc.png'));
			await ctx.drawImage(internetImg, 0, 0, base.width, base.height);
		}

		const attachment = canvas.toBuffer();

		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.util.send(global.translate(message.author.lang, "{0}, tappity tap!", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Nintendo-DS.png' }] });
	}
};

