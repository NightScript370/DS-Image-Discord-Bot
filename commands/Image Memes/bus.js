const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class BusCommand extends Command {
  constructor() {
    super('bus', {
      aliases: ["bus"],
      category: "Image Edits",
      description: {
        content: "Throw someone under a bus!"
      },
      clientPermissions: ['ATTACH_FILES'],
      args: [
	      {
	  			id: "user",
          prompt: {
            start: 'Who would you like to throw under the bus?',
            retry: 'That\'s not something we can throw! Try again.'
          },
					type: "user",
          match: 'rest'
				},
        {
          id: "thrower",
          type: "user",
          default: msg => msg.author,
          match: "option",
          flag: "thrower:"
        }
			],
    });
  }

  async exec(message, { user, thrower }) {
    const deleteimage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bus.png'));
    const maincanvas = await createCanvas(deleteimage.width, deleteimage.height);
		const mainctx = maincanvas.getContext('2d');

		const authorAvatar = await loadImage(thrower.displayAvatarURL({ format: 'png', size: 128 }));
		const targetAvatar = await loadImage(user.displayAvatarURL({ format: 'png', size: 128 }));

    await mainctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height);

    mainctx.rotate(-0.2)
    mainctx.drawImage(authorAvatar, 190, 530, 128, 128)
    mainctx.rotate(0.2)

    mainctx.rotate(0.3)
    mainctx.drawImage(targetAvatar, 1150, 420, 128, 128)
    mainctx.rotate(-0.3)

    const attachment = await maincanvas.toBuffer();
    if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send(`RIP ${user.username}. Was thrown under the bus by ${thrower.username}`, { files: [{ attachment: attachment, name: 'bus.png' }] });
  }
}