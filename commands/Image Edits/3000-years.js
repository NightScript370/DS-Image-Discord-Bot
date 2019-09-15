const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class ThreeThousandYearsCommand extends Command {
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
					type: 'image'
				}
			]
		});
	}

	async exec(message, { images }) {
		let currentimage;

		if (!this.isGood(images))
			return msg.util.reply('No images were found. Please try again.');

		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', '3000-years.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(base, 0, 0);

		for (var image of images) {
			currentimage = await loadImage(image);
			await ctx.drawImage(currentimage, 461, 127, 200, 200);
		}

		const attachment = canvas.toBuffer()
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: '3000-years.png' }] });
	}
};