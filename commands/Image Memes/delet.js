const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class DeleteCommand extends Command {
  constructor() {
    super('delet', {
      aliases: ["delet"],
      category: "Image Memes",
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

  async exec(message, { image }) {
    try {
      let deleteimage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'delete.png'));

			const data = await loadImage(image);
			const canvas = createCanvas(deleteimage.width, deleteimage.height);
			const ctx = canvas.getContext('2d');

      ctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height)
      ctx.drawImage(data, 120, 135, 195, 195)

      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			return message.util.send({ files: [{ attachment, name: 'switch.png' }] });
    } catch (e) {
      return message.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
    }
  }
}