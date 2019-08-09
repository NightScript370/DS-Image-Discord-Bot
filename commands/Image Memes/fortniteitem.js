const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class FortniteItemCommand extends Command {
	constructor() {
		super('fortniteitem', {
			aliases: ['fortniteitem'],
			category: 'Image Memes',
			description: 'Draws a new fortnite item of your choice.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			]
		});
	}

	async exec(msg, { images }) {
		if (!this.isGood(images))
			return msg.reply('No images were found. Please try again.')

		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'fortniteitem.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');

			let currentitem;
			for (var image of images) {
				currentitem = await loadImage(image);
				ctx.drawImage(currentitem, 60, 43, 165, 165);
			}

			ctx.drawImage(base, 0, 0)

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'ifunny.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};