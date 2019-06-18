const { Command } = require('discord-akairo');
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
					type: "integer",
          prompt: {
            start: "What level of pixelation do you want to apply to the image?",
            retry: "That's not a valid level we can apply."
          }
				}
			]
		});
	}

	async exec(msg, { level, image }) {
    if (level < 1) level = 1;
    if (level > 100) level = 100;
		try {
			const data = await loadImage(image);

      const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			const width = canvas.width * (1 / level);
			const height = canvas.height * (1 / level);
			ctx.drawImage(data, 0, 0, width, height);
			ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment, name: 'pixelize.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};