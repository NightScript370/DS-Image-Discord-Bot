const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class NintendoWiiUCommand extends Command {
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
					match: 'option',
					flag: 'pattern:',
					default: null
				}
			]
		});
	}

	async exec(message, { images, nintendonetwork, rating, padding, forcestretch, pattern }) {
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

		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wiiu', 'WiiU_Case.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		// Draw background
		/* if (!isEmpty(BG)) {
			ctx.drawImage(BG, 0, 0, base.width, base.height);
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
			let nintendonetworkImage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'NintendoNetwork.png'));
			ctx.drawImage(nintendonetworkImage, 1368, 156, 139, 175)
		}

		if (!isEmpty(boxrating)) {
			ctx.drawImage(boxrating, 35, 1890, 178, 257);
		}
			
		ctx.drawImage(base, 0, 0, base.width, base.height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
		return message.util.send(global.getString(message.author.lang, "{0}, Wii would like to play, with U!", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'Nintendo-WiiU.png' }] });
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}