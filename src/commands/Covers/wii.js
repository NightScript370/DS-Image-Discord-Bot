import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')
const join = require('path')

module.exports = class WiiCommand extends Command {
	constructor() {
		super('wii', {
			aliases: ['wii'],
			category: 'Covers',
			description: {
				content: "Put an image on a cover for the Nintendo platform filled with Grandma's and Motion Controls"
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
					id: 'forcestretch',
					match: 'flag',
					flag: '--forcestretch'
				},
				{
					id: 'nintendoselects',
					match: 'flag',
					flag: '--nintendoselects'
				},
				{
					id: 'nintendologo',
					match: 'flag',
					flag: '--nintendologo'
				},
				{
					id: 'padding',
					type: 'integer',
					match: 'option',
					flag: 'padding:',
					default: 0
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

	async exec(message, { images, rating, forcestretch, nintendoselects, nintendologo, padding, pattern }) {
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		const base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'wii', 'wii_case.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		// Draw background
		//if (pattern)
			//ctx.drawImage(pattern, 0, 0, base.width, base.height);

		for (var image of images) {
			currentimage = await loadImage(image);
			if((currentimage.width == currentimage.height || (base.height/4) > currentimage.height) && !forcestretch) {
				ctx.drawImage(currentimage, padding, (base.height / 4)+padding, base.width-padding, (base.height/2)-padding);
			} else if ((base.height/3) > currentimage.height && !forcestretch) {
				ctx.drawImage(currentimage, padding, (base.height / 3)+padding, base.width-padding, (base.height/2)-padding);
			} else {
				ctx.drawImage(currentimage, padding, padding, base.width-padding, base.height-padding);
			}
		}

		if (nintendoselects) {
			let nintendoselectborder = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'wii', 'Nintendo_Selects_BG.png'));
			ctx.drawImage(nintendoselectborder, 0, 0, base.width, base.height)
		}

		if (rating)
			ctx.drawImage(rating, 36, 1900, 171, 251);

		if (nintendologo) {
			let nintendologoImage = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'nintendologo.png'));
			ctx.drawImage(nintendologoImage, 1286, 2087, 223, 53)
		}

		ctx.drawImage(base, 0, 0, base.width, base.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.util.send(global.translate(message.author.lang, "{0}, Wii would like to play.", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Nintendo-Wii-boxart.png' }] });
	}
};