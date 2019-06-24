const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');

module.exports = class JPEGifyCommand extends Command {
	constructor() {
		super('JPEGify', {
			aliases: ["jpegify", "needs-more-jpeg", "jpeg"],
			category: 'Image Edits',
			description: 'Draws an image as a low quality JPEG.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				},
				{
					id: 'level',
					type: 'float',
					default: 0.5
				}
			]
		});
	}

	async exec(msg, { images, level }) {
		if (level < 0.01) level = 0.01;
		if (level > 10) level = 10;

		let currentimage, widthpad, heightpad;

		try {
			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			for (var image of images) {
				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}

			const attachment = canvas.toBuffer('image/jpeg', { quality: level / 10 });
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment, name: 'image.jpg' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
