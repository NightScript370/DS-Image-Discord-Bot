const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { drawImageWithTint } = require('../../utils/Canvas');

module.exports = class BurnCommand extends Command {
	constructor() {
		super('burn', {
			aliases: ["fire", "hell", "burn"],
			category: 'Fun',
			description: 'Draws an image with a destructive fire effect.',
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

				drawImageWithTint(ctx, currentimage, '#fc671e', widthpad, heightpad, currentimage.width, currentimage.height);
			}

			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'fire.png'));
			ctx.drawImage(base, 0, 0, imagessize.width, imagessize.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment: attachment, name: 'fire.png' }] });
		} catch (err) {
			return msg.reply("Oh no, now the bot is on fire." +
							 `Ok, seriously speaking, an error has occurred: \`${err.message}\`. Please report this to the Yamamura developers!`);
		}
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}