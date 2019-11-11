import Command from 'discord-akairo';
import { get } from 'node-superfetch';

export default class CreateQRCodeCommand extends Command {
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
		const { body } = await get('https://api.qrserver.com/v1/create-qr-code/')
			.query({ data: text });
		return msg.util.send({ files: [{ attachment: body, name: 'qr-code.png' }] });
	}
};