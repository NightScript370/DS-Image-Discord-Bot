const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class ReverseCommand extends Command {
  constructor() {
    super('reverse', {
      aliases: ["reverse", 'backup'],
      category: "Image Memes",
      description: {
        content: "Shows an man reversing once he sees an image"
      },
      clientPermissions: ['ATTACH_FILES'],
      args: [
	      {
	  			id: "image",
					type: "image"
				}
			],
    });
  }

  async exec(message, { image }) {
    try {
      const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'reverse.png'));

			const data = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(data, 480, 0, base.width-480, 472);
      ctx.drawImage(base, 0, 0, base.width, base.height);

      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			return message.util.send({ files: [{ attachment, name: 'reverse.png' }] });
    } catch (e) {
      return message.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
    }
  }
}