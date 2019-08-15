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
						start: "What should be the subject of the badge?",
						retry: "That's not a subject that you can apply. Try again!"
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

	async exec(message, { subject, status, color }) {
		const { body } = await request.get(`https://img.shields.io/static/v1.svg?label=${subject}&message=${status}&color=${rightColor}&=`);
		return message.util.send({ files: [{ attachment: body, name: 'badge.png' }] });
	}
};