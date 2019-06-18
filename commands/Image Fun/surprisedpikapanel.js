const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../utils/Canvas');

module.exports = class SurprisedPikaPanelCommand extends Command {
  constructor() {
    super('surprisedpikapanel', {
      category: 'Image Fun',
      aliases: ["surprisedpikapanel"],
      description: {
        content: 'Makes an "Surprised Pikachu" meme panel but with your text.',
      },
      args: [
        {
          id: 'items',
          match: 'none',
          prompt: {
            start: [
              'What items would you like to pick from?',
              'Type them in separate messages.',
              'Type `stop` when you are done.'
            ],
            infinite: true
          }
        }
      ]
    });
  }

  async exec(message, { items }) {
    console.log(items);

    const fileTypeRe = /\.(jpe?g|png|gif)$/i;
    let endimage;
    let loadimage;

    if (items.length < 1) return message.channel.send(global.getString("en", "There are not enough arguments to this command. The minimum is {0}.", 1));
    if (items.length > 5) items.length = 5;

    let base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'surprisedpika.png'));
    let y = [0, 148, 295, 442, 588];

    /*
    const image = 'https://cdn.discordapp.com/attachments/562850987144904704/579670265533956151/1qsy1r.png';
		const data = await loadImage(image);
    */

    let canvas;
    if (items.length == 5) {
      canvas = createCanvas(base.width, base.height);
    } else {
      canvas = createCanvas(base.width, y[items.length] - 2)
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(base, 0, 0, base.width, base.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFFFFF";
    let index = 0;
    for (let item in items) {
      if (isNaN(index)) continue;
      if (index == 10) {
        // This is the last image, so use all of the remaining height
        endimage = base.height - y[items.length - 1];
      } else {
        // Get the y position of the current image and the next y position and subtract the two to get the height of the current box
        endimage = y[index+1] - y[index];
      }

      try {
        if (fileTypeRe.test(items[index].split(/[#?]/gmi)[0])) {
          loadimage = await loadImage(items[index])
          ctx.drawImage(loadImage, 0, y[index], 300, endimage)
        } else {
          this.drawBrainText(ctx, items[index], y[index] + 40)
        }
      } catch(e) {
        this.drawBrainText(ctx, items[index], y[index] + 40)
      }

      index++;
    }

    let attachment = canvas.toBuffer()
    if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
    message.util.send(`${message.author}, here's your scared pikachu!`, { files: [{attachment: attachment, name: 'brain.png'}] })
  }

  async drawBrainText(ctx, text, heightstart) {
    /* try {
      ctx.font = "30px Arial";
			let fontSize = 30;
			while (ctx.measureText(text).width > 1100) {
				fontSize -= 1;
				ctx.font = `${fontSize}px Arial`;
			}
			const lines = await wrapText(ctx, text, 252);
      ctx.fillText(lines.join('\n'), 10, heightstart);
    } catch(e) { */
      ctx.fillText(text, 10, heightstart)
//    }

    return ctx
  }
};