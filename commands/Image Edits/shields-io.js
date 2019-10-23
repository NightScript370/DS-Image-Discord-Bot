const { Command } = require("discord-akairo");
const request = require('node-superfetch');

module.exports = class ShieldsIoBadgeCommand extends Command {
	constructor() {
		super('shields-io-badge', {
			aliases: ['shields-io', 'shields-io-badge'],
			category: 'Image Edits',
			description: {
        		content: 'Creates a badge from shields.io.'
      		},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Shields.io',
					url: 'https://shields.io/'
				}
			],
			args: [
				{
					id: 'subject',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, "What should be the subject of the badge?"),
						retry: (msg) => global.translate(msg.author.lang, "That's not a subject that you can apply. Try again!")
					},
					type: 'string'
				},
				{
					id: 'status',
					prompt: {
						start: "What should be the status of the badge?",
						retry: "That's not a status that you can apply. Try again!"
					},
					type: 'string'
				},
				{
					id: 'rightColor',
					type: 'string',
					match: 'option',
					flag: 'rightColor:',
					default: 'brightgreen'
				},
				{
					id: 'leftColor',
					type: 'string',
					match: 'option',
					flag: 'leftColor:',
					default: '555555'
				}
			]
		});
	}

	async exec(message, { subject, status, rightColor, leftColor }) {
		let link = `https://img.shields.io/static/v1.svg?label=${subject}&message=${status}&color=${rightColor}&labelColor=${leftColor}`;
		let attachment = {};

		try {
			let { body } = await request.get(link);
			attachment = { files: [{ attachment: body, name: 'badge.png' }] };
		} catch {}

		let text = global.translate(message.author.lang, "Alright {0}, here's your badge!", message.guild ? message.member.displayName : message.author.username) + "\n" + link
		return message.util.send(text, attachment);
	}
};