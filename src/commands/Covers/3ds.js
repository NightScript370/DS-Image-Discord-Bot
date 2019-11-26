import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')
const join = require('path')

module.exports = class Nintendo3DSCommand extends Command {
	constructor() {
		super('3ds', {
			aliases: ['3ds'],
			category: 'Covers',
			description: {
				content: "Put an image on a cover for the eye-straining glasses-free 3D console"
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
					id: 'nintendonetwork',
					description: 'Draw the Nintendo Network logo on the top right of the 3DS case',
					match: 'flag',
					flag: '--nintendonetwork'
				},
				{
					id: 'nintendologo',
					match: 'flag',
					flag: '--nintendologo'
				},
				{
					id: 'rating',
					match: 'option',
					type: 'gamerating',
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

	async exec(message, { images, nintendologo, nintendonetwork, rating, padding, funky, pattern }) {
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', '3ds.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
	  
		// Draw background
		// if (pattern)
			// ctx.drawImage(pattern, 0, 0, base.width, base.height);

		for (var image of images) {
			currentimage = await loadImage(image);
			await ctx.drawImage(currentimage, 6+padding, 14+padding, 442-padding, 445-padding);
		}

		/* if (funky) {
			let funkyImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ds', 'funkymode.png'));
			await ctx.drawImage(funkyImg, 0, 0, base.width, base.height);
		} */

		await ctx.drawImage(base, 0, 0, base.width, base.height);

		if (nintendologo) {
			let nintendologoImage = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'nintendologo.png'));
			ctx.drawImage(nintendologoImage, 366, 429, 71, 18)
		}

		if (nintendonetwork) {
			let nintendonetworkImage = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'NintendoNetwork.png'));
			ctx.drawImage(nintendonetworkImage, 460, 25, 32, 43)
		}

		if (rating)
			await ctx.drawImage(rating, 18, 385, 37, 59);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send(global.translate(message.author.lang, "{0}, enjoy your now strained eyes!", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Nintendo-DS.png' }] });
	}
};