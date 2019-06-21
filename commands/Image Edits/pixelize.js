const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');

module.exports = class PixelizeCommand extends Command {
	constructor() {
		super('pixelize', {
			aliases: ["pixelize", "censor"],
			category: 'Image Edits',
			description: 'Draws an image with a pixelation effect.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'image',
					type: 'image'
				},
				{
					id: 'level',
					type: (msg, phrase) => {
						if (!phrase || isNaN(phrase)) return null;
						const num = parseInt(phrase);
						if (num < 1 || num > 100) return null;
						return num;
					},
					prompt: {
						start: "What level of pixelation do you want to apply to the image?",
						retry: "That's not a valid level we can apply."
          }
				}
			]
		});
	}

	async exec(msg, { level, image }) {
		let currentimage, widthpad, heightpad;

		try {
			// Create canvas and canvas2 (the latter is a temporary one)
			const imagessize = await this.largestSize(images);
			const canvas = await createCanvas(imagessize.width, imagessize.height);
			const ctx = canvas.getContext('2d');
			const canvas2 = await createCanvas(imagessize.width, imagessize.height);
			const ctx2 = canvas.getContext('2d');

			// Don't smooth the images
			ctx.imageSmoothingEnabled = false;
			ctx2.imageSmoothingEnabled = false;

			const width = canvas.width * (1 / level);
			const height = canvas.height * (1 / level);

			for (var image of images) {
				currentimage = await loadImage(image);
				let ciw = currentimage.width  / level;
				let cih = currentimage.height / level;

				widthpad = (width - ciw) / 2;
				heightpad = (height - cih) / 2;

				ctx2.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}
			
			ctx.drawImage(canvas2, 0, 0, width, height, 0, 0, canvas.width, canvas.height);

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment, name: 'pixelize.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
