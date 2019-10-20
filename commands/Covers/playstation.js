const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class PlayStationCommand extends Command {
	constructor() {
		super('playstation', {
			aliases: ['ps', 'playstation', 'プレイステーション'],
			category: 'Covers',
			description: {
				content: "Put an image on a cover for the console that was made because Nintendo screwed them over"
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
					id: 'gloss',
					match: 'flag',
					flag: '--gloss'
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

	async exec(message, { images, rating, padding, gloss, funky, pattern }) {
		let currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'playstation', gloss ? 'gloss.png' : 'nogloss.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		// Draw background
		//if (pattern)
			//ctx.drawImage(pattern, 0, 0, base.width, base.height);

		for (var image of images) {
			currentimage = await loadImage(image);
			await ctx.drawImage(currentimage, 72+padding, 8+padding, 200-padding, 230-padding);
		}

		if (funky) {
			let funkyImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'funky.png'));
			await ctx.drawImage(funkyImg, 147, 7, 125, 88);
		}

		await ctx.drawImage(base, 0, 0, base.width, base.height);

		if (rating)
			await ctx.drawImage(rating, 38, 194, 22, 33);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send(global.lang.getString(message.author.lang, "{0}, I hope you like texture warping.", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Playstation.png' }] });
	}
};