const { Command } = require("discord-akairo");
const request = require('node-superfetch');

module.exports = class ShieldsIoBadgeCommand extends Command {
	constructor() {
		super('shields-io-badge', {
			aliases: ['shields-io', 'shields-io-badge'],
			category: 'Image Fun',
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

	async exec(msg, { subject, status, color }) {
		try {
			const { body } = await request.get(`https://img.shields.io/badge/${subject}-${status}-${color}.png`);
			return msg.util.send({ files: [{ attachment: body, name: 'badge.png' }] });
		} catch (err) {
			if (err.status === 404) return msg.reply('Could not create the badge...');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};