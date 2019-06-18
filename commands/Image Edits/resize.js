const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');

module.exports = class ResizeCommand extends Command {
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
					type: 'integer',
          prompt: {
            start: "What width do you want to apply to the image?",
            retry: "That's not a valid width we can apply."
          }
				},
				{
					id: 'height',
					type: 'integer',
          prompt: {
            start: "What height of distortion do you want to apply to the image?",
            retry: "That's not a valid height we can apply."
          }
				},
        {
					id: 'image',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { width, height, image }) {
    if (width < 1) return msg.reply('Sorry, but the width is too small');
    if (height < 1) return msg.reply('Sorry, but the height is too small');

		try {
			const data = await loadImage(image);
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(data, 0, 0, width, height);

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'stretch.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};