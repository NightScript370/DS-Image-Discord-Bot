const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

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

	async exec(message, { images, thrower }) {
		let currentimage, widthpadthrow, heightpadthrow, widthpadthrown, heightpadthrown;

		console.log(images)
		console.log(thrower)

		if (!this.isGood(images))
			return message.util.reply('Nothing valid was found to throw. Please try again.')

		if (!this.isGood(thrower))
			return message.util.reply('No valid thrower was found. Please try again.')


		const imagessizethrow = await this.largestSize(images);
		const canvasthrow = await createCanvas(imagessizethrow.width, imagessizethrow.height);
		const ctxthrow = canvasthrow.getContext('2d');

		for (var image of images) {
			currentimage = await loadImage(image);

			widthpadthrow = (imagessizethrow.width - currentimage.width) / 2;
			heightpadthrow = (imagessizethrow.height - currentimage.height) / 2;

			ctxthrow.drawImage(currentimage, widthpadthrow, heightpadthrow, currentimage.width, currentimage.height);
		}


		const imagessizethrown = await this.largestSize(thrower);
		const canvasthrown = await createCanvas(imagessizethrown.width, imagessizethrown.height);
		const ctxthrown = canvasthrown.getContext('2d');

		for (var throwered of thrower) {
			currentimage = await loadImage(throwered);

			widthpadthrown = (imagessizethrown.width - currentimage.width) / 2;
			heightpadthrown = (imagessizethrown.height - currentimage.height) / 2;

			ctxthrown.drawImage(currentimage, widthpadthrown, heightpadthrown, currentimage.width, currentimage.height);
		}


		

		const deleteimage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bus.png'));
		const maincanvas = await createCanvas(deleteimage.width, deleteimage.height);
		const mainctx = maincanvas.getContext('2d');

		await mainctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height);

		mainctx.rotate(-0.2)
		mainctx.drawImage(canvasthrown, 190, 530, 128, 128)
		mainctx.rotate(0.2)

		mainctx.rotate(0.3)
		mainctx.drawImage(canvasthrow, 1150, 420, 128, 128)
		mainctx.rotate(-0.3)

		const attachment = await maincanvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send(`RIP whatever was thrown under a bus`, { files: [{ attachment: attachment, name: 'bus.png' }] });
	}
}