const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class BusCommand extends Command {
  constructor() {
    super('bus', {
      aliases: ["bus"],
      category: "Image Memes",
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
    let authorURL = thrower.displayAvatarURL({ format: 'png', size: 128 });
    let targetURL = user.displayAvatarURL({ format: 'png', size: 128 });

    try {
      let deleteimage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bus.png'));
      console.log("Loaded delete image")

      let authorInfo = await request.get(authorURL);
			let authorAvatar = await loadImage(authorInfo.body);
      console.log("Loaded avatar image")

      let targetInfo = await request.get(targetURL);
			let targetAvatar = await loadImage(targetInfo.body);
      console.log("Loaded target image")

			const maincanvas = createCanvas(deleteimage.width, deleteimage.height);
			const mainctx = maincanvas.getContext('2d');
      mainctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height);

      /*
      const authorCanvas = createCanvas(authorAvatar.width, authorAvatar.height);
			const authorctx = authorCanvas.getContext('2d');
      authorctx.rotate(-0.1)
      authorctx.drawImage(authorAvatar, 0, 0, authorAvatar.width, authorAvatar.height);
      authorctx.rotate(0.1)
      message.channel.send('authorAvatar', {files: [{ attachment: authorCanvas.toBuffer(), name: 'authorcanvas.png'}]})

      const targetCanvas = createCanvas(targetAvatar.width, targetAvatar.height);
			const targetctx = targetCanvas.getContext('2d');
      targetctx.rotate(-8)
      targetctx.drawImage(targetAvatar, 0, 0, targetAvatar.width, targetAvatar.height)
      targetctx.rotate(8) 

      mainctx.drawImage(authorCanvas, 336, 518, 128, 128)
      mainctx.drawImage(targetCanvas, 450, 345, 80, 80)
      */
      
      mainctx.rotate(-0.2)
      mainctx.drawImage(authorAvatar, 190, 530, 128, 128)
      mainctx.rotate(0.2)
      
      mainctx.rotate(0.3)
      mainctx.drawImage(targetAvatar, 1150, 420, 128, 128)
      mainctx.rotate(-0.3)

      const attachment = maincanvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			return message.channel.send({ files: [{ attachment: attachment, name: 'bus.png' }] });
    } catch (e) {
      return message.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
    }
  }
}