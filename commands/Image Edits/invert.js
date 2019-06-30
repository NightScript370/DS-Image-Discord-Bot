const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const { invert } = require('../../utils/Canvas');

module.exports = class InvertCommand extends Command {
	constructor() {
		super('invert', {
			aliases: ["invert"],
			category: 'Image Edits',
			description: 'Draws the negative of an image.',
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

			invert(ctx, 0, 0, imagessize.width, imagessize.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'invert.png' }] });
		} catch (err) {
			console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
