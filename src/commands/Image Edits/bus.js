const Command = require('../../struct/Image-Command.js');
const createCanvas, loadImage  = require('canvas')
const join = require('path')

module.exports = class BusCommand extends Command {
	constructor() {
		super('bus', {
			aliases: ["bus"],
			category: "Image Edits",
			description: {
				content: "Throw something under a bus!"
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: "images",
					type: "image",
					match: 'rest'
				},
				{
					id: "thrower",
					type: 'image-nohistoryattachment',
					default: msg => [msg.author.displayAvatarURL({format: 'png'})],
					match: "option",
					flag: "thrower:"
				}
			],
		});
	}

	exec(message, { images, thrower }) {
		const __ = (k, ...v) => global.translate(authorMessage.author.lang, k, ...v)
		let currentimage, widthpadthrow, heightpadthrow, widthpadthrown, heightpadthrown;

		if (!this.isGood(images))
			return message.util.reply(__('Nothing valid was found to throw. Please try again.'))

		if (!this.isGood(thrower))
			return message.util.reply(__('No valid thrower was found. Please try again.'))


		const imagessizethrow = this.largestSize(images);
		const canvasthrow = createCanvas(imagessizethrow.width, imagessizethrow.height);
		const ctxthrow = canvasthrow.getContext('2d');

		for (var image of images) {
			currentimage = loadImage(image);

			widthpadthrow = (imagessizethrow.width - currentimage.width) / 2;
			heightpadthrow = (imagessizethrow.height - currentimage.height) / 2;

			ctxthrow.drawImage(currentimage, widthpadthrow, heightpadthrow, currentimage.width, currentimage.height);
		}


		const imagessizethrown = this.largestSize(thrower);
		const canvasthrown = createCanvas(imagessizethrown.width, imagessizethrown.height);
		const ctxthrown = canvasthrown.getContext('2d');

		for (var throwered of thrower) {
			currentimage = loadImage(throwered);

			widthpadthrown = (imagessizethrown.width - currentimage.width) / 2;
			heightpadthrown = (imagessizethrown.height - currentimage.height) / 2;

			ctxthrown.drawImage(currentimage, widthpadthrown, heightpadthrown, currentimage.width, currentimage.height);
		}

		const deleteimage = loadImage(join(__dirname, '..', '..', '..', 'assets', 'images', 'bus.png'));
		const maincanvas = createCanvas(deleteimage.width, deleteimage.height);
		const mainctx = maincanvas.getContext('2d');

		mainctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height);

		mainctx.rotate(-0.2)
		mainctx.drawImage(canvasthrown, 190, 530, 128, 128)
		mainctx.rotate(0.2)

		mainctx.rotate(0.3)
		mainctx.drawImage(canvasthrow, 1150, 420, 128, 128)
		mainctx.rotate(-0.3)

		const attachment = maincanvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply(__('Resulting image was above 8 MB.'));
		return message.util.send(__("RIP whatever {0} threw under a bus", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'bus.png' }] });
	}
}