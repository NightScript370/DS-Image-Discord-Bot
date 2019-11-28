import Command from '../../struct/Image-Command.js';
import canvas from 'canvas';
const { createCanvas, loadImage } = canvas

export default class ResizeCommand extends Command {
	constructor() {
		super('resize', {
			aliases: ["resize", 'stretch'],
			category: 'Image Edits',
			description: 'Resizes an image.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'width',
					type: (msg, phrase) => {
						if (!phrase || isNaN(phrase)) return null;
						const num = parseInt(phrase);
						if (num < 1) return null;
						return num;
					},
					prompt: {
						start: "What width do you want to apply to the image?",
						retry: "That's not a valid width we can apply."
					}
				},
				{
					id: 'height',
					type: (msg, phrase) => {
						if (!phrase || isNaN(phrase)) return null;
						const num = parseInt(phrase);
						if (num < 1) return null;
						return num;
					},
					prompt: {
						start: "What height of distortion do you want to apply to the image?",
						retry: "That's not a valid height we can apply."
					}
				},
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			]
		});
	}

	async exec(message, { width, height, images }) {
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		// Create canvas and canvas2 (the latter is a temporary one)
		const imagessize = await this.largestSize(images);
		const canvas = await createCanvas(width, height);
		const ctx = canvas.getContext('2d');
		const canvas2 = await createCanvas(imagessize.width, imagessize.height);
		const ctx2 = canvas2.getContext('2d');

		for (var image of images) {
			currentimage = await loadImage(image);

			widthpad = (imagessize.width - currentimage.width) / 2;
			heightpad = (imagessize.height - currentimage.height) / 2;

			ctx2.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
		}

		ctx.drawImage(canvas2, 0, 0, width, height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'stretch.png' }] });
	}
};
