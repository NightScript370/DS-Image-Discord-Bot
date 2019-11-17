import Command from '../../struct/Image-Command';
import { createCanvas, loadImage } from 'canvas';

export default class CircleCommand extends Command {
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

	async exec(message, { images }) {
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		const imagessize = await this.largestSize(images);
		const canvas = await createCanvas(imagessize.width, imagessize.height);
		const ctx = canvas.getContext('2d');
		const canvas2 = await createCanvas(imagessize.width, imagessize.height);
		const ctx2 = canvas.getContext('2d');

		ctx.beginPath();
		ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		for (var image of images) {
			currentimage = await loadImage(image);

			widthpad = (imagessize.width - currentimage.width) / 2;
			heightpad = (imagessize.height - currentimage.height) / 2;

			ctx2.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
		}
		ctx.drawImage(canvas2, (canvas.width / 2) - (canvas2.width / 2), (canvas.height / 2) - (canvas2.height / 2));

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'circle.png' }] });
	}
};
