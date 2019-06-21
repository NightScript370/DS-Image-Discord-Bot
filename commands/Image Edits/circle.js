const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');

module.exports = class CircleCommand extends Command {
	constructor() {
		super('circle', {
			aliases: ["circle"],
			category: 'Image Edits',
			description: {
        content: 'Draws an image, but with a circle around it.'
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

		try {
			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');

			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();

			for (var image of images) {
				currentimage = await loadImage(image);

				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				ctx.drawImage(currentimage, (canvas.width / 2) - (widthpad / 2), (canvas.height / 2) - (heightpad / 2), (canvas.width / 2) - (currentimage.width / 2), (currentimage.height / 2));
			}

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'circle.png' }] });
		} catch (err) {
			console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
