const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class NintendoSwitchCommand extends Command {
	constructor() {
		super('switch', {
			aliases: ['switch'],
			category: 'Covers',
			description: {
				content: "Put an image in the cover for Nintendo's new platform that can't identify if it's a handheld or a home console."
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
					id: 'chubby',
					match: 'flag',
					flag: '--chubby'
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

	async exec(message, { images, rating, chubby, forcestretch, internet, funky, pattern }) {
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'switch_case.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		// Draw background
		if (pattern)
			ctx.drawImage(pattern, 0, 0, base.width, base.height);

		for (var image of images) {
			currentimage = await loadImage(image);
			if (currentimage.width == currentimage.height && !forcestretch) {
				ctx.drawImage(currentimage, 4, 199, 553, 553);
			} else if((base.height/4) > currentimage.height && !forcestretch) {
				if (chubby) {
					ctx.drawImage(currentimage, 0, (base.height / 4), base.width, (base.height/2));
				} else {
					ctx.drawImage(currentimage, 15, (base.height / 4), (base.width-35), (base.height/2));
				}
			} else if ((base.height/3) > currentimage.height && !forcestretch) {
				if (chubby) {
					ctx.drawImage(currentimage, 0, (base.height / 3), base.width, (base.height/2));
				} else {
					ctx.drawImage(currentimage, 15, (base.height / 3), (base.width-35), (base.height/2));
				}
			} else {
				ctx.drawImage(currentimage, 5, 24, 552, 900);
			}
		}

		if (rating)
			ctx.drawImage(rating, 22, 810, 62, 94);

		if (internet) {
			let internetImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'internet_download.png'));
			ctx.drawImage(internetImg, 0, 0, base.width, base.height)
		}

		if (funky) {
			let funkyImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'funky_mode.png'));
			ctx.drawImage(funkyImg, 0, 0, base.width, base.height)
		}

		ctx.drawImage(base, 0, 0, base.width, base.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.util.send(global.getString(message.author.lang, "{0}, here's a console game, now its portable!", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'nintendo-switch-boxart.png' }] });
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}