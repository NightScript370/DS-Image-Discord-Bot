const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const { contrast } = require('../../utils/Canvas');

module.exports = class ContrastCommand extends Command {
	constructor() {
		super('contrast', {
			aliases: ["contrast"],
			category: 'Image Edits',
			description: {
				content: 'Draws an image, but with increased contrast.'
			},
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
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return msg.reply('No images were found. Please try again.')

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

			contrast(ctx, 0, 0, imagessize.width, imagessize.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'contrast.png' }] });
		} catch (err) {
			console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Please report this error to the Yamamura developers!`);
		}
	}
};
