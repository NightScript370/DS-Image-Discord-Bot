const { Command } = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class CreateQRCodeCommand extends Command {
	constructor() {
		super('create-qr-code', {
			aliases: ["qr-code", 'create-qr', 'create-qr-code', "qrcode", "createqr", "createqrcode"],
      clientPermissions: ['ATTACH_FILES'],
			category: 'Useful',
			description: {
        content: 'Converts text to a QR Code.',
        usage: '<text to convert into a QR code>',
        examples: ['https://discord.gg/vbYZCRZ']
      },
			credit: [
				{
					name: 'QR Code Generator\'s QR code API',
					url: 'http://goqr.me/api/'
				}
			],
			args: [
				{
					id: 'text',
          prompt: {
              start: 'What would you like to turn into a QR code?',
              retry: 'That\'s not something we can turn into a QR code! Try again.'
          },
          type: 'string',
          match: 'content'
				}
			]
		});
	}

	async exec(msg, { text }) {
		try {
			const { body } = await request
				.get('https://api.qrserver.com/v1/create-qr-code/')
				.query({ data: text });
			return msg.channel.send({ files: [{ attachment: body, name: 'qr-code.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};