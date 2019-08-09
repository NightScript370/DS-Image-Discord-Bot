const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class IfunnyCommand extends Command {
	constructor() {
		super('ifunny', {
			aliases: ['ifunny'],
			category: 'Image Edits',
			description: 'Draws an image with the iFunny logo.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'iFunny',
					url: 'https://ifunny.co/'
				}
			],
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
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return msg.reply('No images were found. Please try again.')

		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ifunny.png'));

			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			for (var image of images) {
				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}
			ctx.fillStyle = '#181619';
			ctx.fillRect(0, canvas.height - base.height, canvas.width, base.height);
			ctx.drawImage(base, canvas.width - base.width, canvas.height - base.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'ifunny.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
