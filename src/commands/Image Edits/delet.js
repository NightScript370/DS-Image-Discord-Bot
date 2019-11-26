import Command from '../../struct/Image-Command.js';
const createCanvas, loadImage  = require('canvas')
const join = require('path')

module.exports = class DeleteCommand extends Command {
	constructor() {
		super('delet', {
			aliases: ["delet"],
			category: "Image Edits",
			description: "Shows an image of the Delete File prompt on Windows.",
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			],
		});
	}

	exec(message, { images }) {
		const __ = (k, ...v) => global.translate(message.author.lang, k, ...v)
		let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return message.util.reply(__('No images were found. Please try again.'))

		let deleteimage = loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'delete.png'));

		const canvas = createCanvas(deleteimage.width, deleteimage.height);
		const ctx = canvas.getContext('2d');

		const imagessize = this.largestSize(images);
		const tempcanvas = createCanvas(imagessize.width, imagessize.height);
		const tempctx = tempcanvas.getContext('2d');

		for (var image of images) {
			currentimage = loadImage(image);

			widthpad = (imagessize.width - currentimage.width) / 2;
			heightpad = (imagessize.height - currentimage.height) / 2;

			tempctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
		}

		ctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height)
		ctx.drawImage(tempcanvas, 120, 135, 195, 195)

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply(__('Resulting image was above 8 MB.'));
		return message.util.send(__("{0}, don't forget to take a backup.", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment, name: 'delet.png' }] });
	}
}
