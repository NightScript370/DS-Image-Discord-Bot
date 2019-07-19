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
				},
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				},
			]
		});
	}

	async exec(msg, { level, images }) {
		let currentimage, widthpad, heightpad;

		try {
			const width = result.width * (1 / level);
			const height = result.height * (1 / level);

			// Create canvas and canvas2 (the latter is a temporary one)
			const imagessize = await this.largestSize(images);
			const result = await createCanvas(imagessize.width, imagessize.height);
			const c_res = result.getContext('2d');
			const images = await createCanvas(imagessize.width, imagessize.height);
			const c_images = images.getContext('2d');
			const small = await createCanvas(width, height);
			const c_small = small.getContext("2d");

			// Don't smooth the images
			c_res.imageSmoothingEnabled = false;
			c_images.imageSmoothingEnabled = false;

			for (var image of images) {
				currentimage = await loadImage(image);
				let ciw = currentimage.width  / level;
				let cih = currentimage.height / level;

				widthpad = (width - ciw) / 2;
				heightpad = (height - cih) / 2;

				c_images.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			}

			c_small.drawImage(images, 0, 0, width, height);
			c_res.drawImage(c_small, 0, 0, width, height, 0, 0, result.width, result.height);

			const attachment = result.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment, name: 'pixelize.png' }] });
		} catch (err) {
			console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
