import Command from '../../struct/Image-Command.js';
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

export default class ReverseCommand extends Command {
	constructor() {
		super('reverse', {
			aliases: ["reverse", 'backup'],
			category: "Image Edits",
			description: {
				content: "Shows an man reversing once he sees an image"
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				},
				{
					id: 'layerstretch',
					match: 'flag',
					flag: '--layerstretch'
				}
			],
		});
	}

	async exec(message, { images, layerstretch }) {
		let currentimage, widthpad, heightpad, imagessize, layeredCanvas, layeredCtx;

		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

		if (!layerstretch) {
			imagessize = await this.largestSize(images);
			layeredCanvas = await createCanvas(imagessize.width, imagessize.height);
			layeredCtx = layeredCanvas.getContext('2d');
		}

		const baseImage = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'reverse.png'));
		const baseCanvas = createCanvas(baseImage.width, baseImage.height);
		const baseCtx = baseCanvas.getContext('2d');

		for (var image of images) {
			currentimage = await loadImage(image);

			if (!layerstretch) {
				widthpad = (imagessize.width - currentimage.width) / 2;
				heightpad = (imagessize.height - currentimage.height) / 2;

				layeredCtx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
			} else {
				baseCtx.drawImage(currentimage, 480, 0, baseImage.width-480, 472)
			}
		}

		if (!layerstretch) {
			baseCtx.drawImage(layeredCanvas, 480, 0, baseImage.width-480, 472)
		}

		baseCtx.drawImage(baseImage, 0, 0);

		const attachment = baseCanvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment: attachment, name: 'reverse.png' }] });
	}
}