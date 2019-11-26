import { Command } from 'discord-akairo';

export default class ServerPointsCommand extends Command {
	constructor() {
		super('give', {
			aliases: ['give', "gift", 'donate'],
			category: 'Experience Points',
			description: {
				content: 'Give a server member a specified amount of points.',
				usage: '<user> <amount> guild:[OPTIONAL: Make transaction on different server]',
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
					type: 'javierInteger',
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
				{
					id: 'override',
					description: "Used by bot owners to override bot limits",
					match: 'flag',
					flag: '--bot-owner-override'
				},
			],
		});
	}

	async exec(message, { user, amount, guild, action, override }) {
		const __ = (k, ...v) => global.translate(message.author.lang, k, ...v);
		let guildFound;

		if (user.bot) return message.util.reply(__("bots do not collect Experience Points! Please try this command on a different user"));
		if (!guild) return message.util.reply(__("You need to set a server in order to make a transaction in regards to a member of that server. Try again"));

		if (!message.guild || (message.guild && message.guild.id !== guild.id)) {
			let guildFind = this.client.guilds.get(guild.id)
			if (!guildFind) return message.util.reply(__("Yamamura is not in that server. Therefore, I cannot get that server's points"));

			if (!guildFind.members.has(message.author.id)) return message.util.reply(__('you may not see the statistics of a server you are not in. Try again later'));

			guildFound = guildFind;
		} else
			guildFound = message.guild

		let authorGuildMember = await guildFound.members.get(message.author.id);

		if (!this.client.isOwner(authorGuildMember.user)) override = false;

		let DBuser = await this.client.db.points.findOne({guild: guildFound.id, member: user.id});
		if (!DBuser) {
			if (!authorGuildMember)
				return message.util.reply(__("you can't give points to someone who is/was not in the server. Please try again on a different user."));

			DBuser = await this.client.db.points.insert({guild: guildFound.id, member: user.id, points: 0, level: 0});
		}

		let DBAuthor = await this.client.db.points.findOne({guild: guildFound.id, member: message.author.id});
		if (!DBAuthor)
			DBuser = await this.client.db.points.insert({guild: guildFound.id, member: message.author.id, points: 0, level: 0});

		if (!authorGuildMember.permissions.has('MANAGE_MESSAGES') && !override) {
			if (user.id == message.author.id) return message.util.reply(__("you would not benefit from that."));
			if (amount < 0) return message.util.reply(__("you may not steal points!"));

			if (amount > DBAuthor.points) return message.util.reply("You do not have enough points to donate to the user! Please try again once you collect more points");

			DBAuthor.points = DBAuthor.points - amount;

			var level = 0;
			var limit = 0;
			while (DBAuthor.points > limit) {
				limit = 180 * (level+1) + (10*level);
				level++;
			}

			DBAuthor.level = level;

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

		var level1 = 0;
		var limit1 = 0;
		while (DBUser.points > limit1) {
			limit1 = 180 * (level1+1) + (10*level1);
			level1++;
		}

		DBUser.level = level1;

		let BotThanks = `thank you so much for donating ${amount} points to ${user.tag}. They are now at level ${DBuser.level}.`;
		if (!authorGuildMember.permissions.has('MANAGE_MESSAGES') && !override)
			BotThanks += `\n Unfortunately, that also means you're now down to ${DBAuthor.points} points, and are now at level ${DBAuthor.level}`;

		await message.util.reply(BotThanks);
	}
};