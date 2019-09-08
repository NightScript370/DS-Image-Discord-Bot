const { Command } = require('discord-akairo');

module.exports = class ServerPointsCommand extends Command {
	constructor() {
		super('give', {
			aliases: ['give', "gift", 'donate'],
			category: 'Experience Points',
			description: {
				content: 'Give a server member a specified amount of points.',
				usage: '<user. Leave blank for your points> guild:<optional field. This is available for viewing a specific guild\'s user point>',
				examples: ['178261738364338177', '209041316867342336 guild:318882333312679936']
			},
			args: [
				{
					id: 'user',
					description: "This field contains the user you'd like to give server points too. This can either be a mention, username or user ID",
					type: 'user-commando',
					prompt: {
						start: 'Who would you like to donate points to?',
						retry: 'That\'s not something we can give points to! Try again.'
					},
					match: 'rest'
				},
				{
					id: 'amount',
					description: "This argument is the amount of points you'd like to donate to the user.",
					type: 'integer',
					prompt: {
						start: 'How many points would you like to donate?',
						retry: 'That\'s an invalid amount of points! Try again.'
					}
				},
				{
					id: 'guild',
					description: "This argument is for the guild ID you'd like your transactions to go through. Will default itself to the guild ID of the current server if its on a server.",
					type: 'guild',
					default: msg => {
						if (msg.guild)
							return msg.guild;

						return null;
					},
					match: 'option',
					flag: 'guild:'
				},
				{
					id: 'action',
					description: "This is the action you will perform for the user. It can be either adding, setting or removing",
					match: 'option',
					flag: 'action:',
					type: ["set", "add", "remove"],
					default: "add"
				},
			],
		});
	}

	async exec(message, { user, amount, guild, action }) {
		const client = await this.client
		let guildFound;

		if (user.bot) return message.util.reply("bots do not collect Experience Points! Please try this command on a different user");
		if (!guild) return message.util.reply("You need to set a server in order to make a transaction in regards to a member of that server. Try again");

		if (!message.guild || (message.guild && message.guild.id !== guild.id)) {
			let guildFind = client.guilds.get(guild.id)
			if (!guildFind) return message.util.reply("Yamamura is not in that server. Therefore, I cannot get that server's points");

			if (!guildFind.members.has(message.author.id)) return message.util.reply('you may not see the statistics of a server you are not in. Try again later');

			guildFound = guildFind;
		} else
			guildFound = message.guild

		let authorGuildMember = await guildFound.members.get(msg.author.id);

		let DBuser = await this.client.db.points.findOne({guild: guildFound.id, member: user.id});
		if (!DBuser) {
			if (!authorGuildMember)
				return message.util.reply("you can't give points to someone who is/was not in the server. Please try again on a different user.");

			DBuser = await this.client.db.points.insert({guild: guildFound.id, member: user.id, points: 0, level: 0});
		}

		let DBAuthor = await this.client.db.points.findOne({guild: guildFound.id, member: message.author.id});
		if (!DBAuthor)
			DBuser = await this.client.db.points.insert({guild: guildFound.id, member: message.author.id, points: 0, level: 0});

		if (!authorGuildMember.permissions.has('MANAGE_MESSAGES')) {
			if (user.id == message.author.id) return message.util.reply("you would not benefit from that.");
			if (amount < 0) return message.util.reply("you may not steal points!");

			if (amount > DBAuthor.points) return message.util.reply("You do not have enough points to donate to the user! Please try again once you collect more points");

			DBAuthor.points = DBAuthor.points - amount;
			DBAuthor.level = Math.floor(DBAuthor.points / 350);

			action = 'add';
		}

		switch (action) {
			case 'set':
				DBuser.points = amount;
				break;
			case 'remove':
				DBuser.points = DBuser.points - amount;
				break;
			case 'add':
				DBuser.points = DBuser.points + amount;
				break;
		}

		DBuser.level = Math.floor(DBuser.points / 350);

		let BotThanks = `thank you so much for donating ${amount} points to ${user.tag}. He's now at level ${DBuser.level}.`;
		if (!authorGuildMember.permissions.has('MANAGE_MESSAGES'))
			BotThanks += `\n Unfortunately, that also means you're now down to ${DBAuthor.points} points, and are now at level ${DBAuthor.level}`;

		await message.util.reply(BotThanks);
	}
};