const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const { distort } = require('../../utils/Canvas');

module.exports = class DistortCommand extends Command {
	constructor() {
		super('distort', {
			aliases: ["distort"],
			category: 'Image Edits',
			description: 'Draws an image with a distortion effect.',
			cooldown: 10000,
			ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'level',
					type: 'integer',
					prompt: {
						start: "What level of distortion do you want to apply to the image?",
						retry: "That's not a valid level we can apply."
					}
				},
				{
					id: 'image',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { level, image }) {
		try {
			const data = await loadImage(image);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(data, 0, 0);
			distort(ctx, level, 0, 0, data.width, data.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'distort.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};