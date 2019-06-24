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
					prompt: 'What is the subject of the badge?',
					type: 'string',
					parse: subject => encodeURIComponent(subject.replace(/-/g, '--').replace(/_/g, '__'))
				},
				{
					id: 'status',
					prompt: 'What is the status of the badge?',
					type: 'string',
					parse: status => encodeURIComponent(status.replace(/-/g, '--').replace(/_/g, '__'))
				},
				{
					id: 'color',
					prompt: 'What is the color of the badge?',
					type: 'string',
					default: 'brightgreen'
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