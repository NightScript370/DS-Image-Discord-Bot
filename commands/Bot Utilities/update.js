import Command from '../../struct/Command';
import { execSync } from 'child_process';

export default class UpdateCommand extends Command {
	constructor() {
		super('update', {
			aliases: ['update'],
			category: 'Bot Utilities',
			description: {
				content: 'Updates the bot to the latest commit from our GitLab repository.',
			},
			ownerOnly: true,
		});
	}

	async exec(message) {
		let responce = await message.util.send('Updating bot');
		
		try {
			execSync('git pull');
			responce.edit('Bot updated successfully, please reload the changes');
		} catch (e) {
			console.error(e);
			responce.edit('There was an error when updating the bot. Please try again');
		}
	}
};
