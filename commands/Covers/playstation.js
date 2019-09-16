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
					default: null
				}
			]
		});
	}

	async exec(message, { images, rating, padding, gloss, funky, pattern }) {
		let boxrating, BG, currentimage;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.');

		/* switch (pattern.toLowerCase()) {
			case 'wifi':
				BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'wifi.png'));
				break;
			case 'sponge':
				BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'sponge.png'));
				break;
			case 'jungle':
				BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'jungle.png'));
				break;
			case 'joker':
				BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'joker.png'));
				break;
		} */

		let ratingtype = (rating ? rating.toUpperCase().split(":")[0] : null);

		switch (rating ? rating.toUpperCase() : null) {
			case 'ESRB:CHILDHOOD':
			case 'ESRB:EC':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'earlyChildhood.png'));
				break;
			case 'ESRB:E':
			case 'ESRB:EVERYONE':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'everyone.png'));
				break;
			case 'ESRB:EVERYONE10+':
			case 'ESRB:E10':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'e10.png'));
				break;
			case 'ESRB:MATURE':
			case 'ESRB:MATURE17':
			case 'ESRB:M':
			case 'ESRB:M17':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'mature.png'));
				break;
			case 'ESRB:T':
			case 'ESRB:TEEN':
			case 'ESRB:TEENS':
			case 'ESRB:TEENAGERS':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'teen.png'));
				break;
			case 'ESRB:A':
			case 'ESRB:AO':
			case 'ESRB:ADULTS':
			case 'ESRB:ADULTS18':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'adultsOnly.png'));
				break;
			case 'ESRB:RP':
			case 'ESRB:RATING_PENDING':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'ratingPending.png'));
				break;
			case 'PEGI:3':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '3.png'));
				break;
			case 'PEGI:7':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '7.png'));
				break;
			case 'PEGI:12':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '12.png'));
				break;
			case 'PEGI:16':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '16.png'));
				break;
			case 'PEGI:18':
				boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '18.png'));
				break;
		}

		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'playstation', gloss ? 'gloss.png' : 'nogloss.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
	  
		// Draw background
		if (BG)
			ctx.drawImage(BG, 0, 0, base.width, base.height);

		for (var image of images) {
			currentimage = await loadImage(image);
			await ctx.drawImage(currentimage, 72+padding, 8+padding, 200-padding, 230-padding);
		}

		if (funky) {
			let funkyImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'funky.png'));
			await ctx.drawImage(funkyImg, 147, 7, 125, 88);
		}

		await ctx.drawImage(base, 0, 0, base.width, base.height);

		if (boxrating)
			await ctx.drawImage(boxrating, 38, 194, 22, 33);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send(global.getString(message.author.lang, "{0}, I hope you like texture warping.", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Playstation.png' }] });
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}