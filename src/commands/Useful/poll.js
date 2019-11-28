import discordAkairo from 'discord-akairo';

export default class PollCommand extends discordAkairo.Command {
	constructor() {
		super("poll", {
			aliases: ['poll', 'vote'],
			category: 'Useful',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Creates a poll with up to 10 choices.',
				examples: ["What's your favourite food? time:10"]
			},
			args: [
				{
					id: 'question',
					description: 'This is a mandatory field.',
					prompt: {
						start: "What's the poll Question?",
						retry: "That's not a valid question we can ask on this poll."
					},
					type: "string",
					match: "rest"
				},
				{
					id: 'pollOptions',
					type: 'string',
					match: 'none',
					prompt: {
						start: [
							'What are the poll options?',
							'Type them in separate messages.',
							'Type `stop` when you are done.'
						],
						limit: 14
					},
				},
				{
					id: 'time',
					match: "option",
					flag: "time:",
					type: 'integer',
					default: 0,
				},
			]
		});
	}

	async exec(AuthorMessage, { question, pollOptions, time }) {
		let pollOptionsLength = pollOptions.length;
		let i = 0;

		let simpleResponce = false;
		let emojiList = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵'];

		if (pollOptions[0] == "yesno") {
			simpleResponce = true;
			emojiList = ['👍','👎','🤷'];
			pollOptions = ['Yes', 'No', 'Shrug'];
		} else if (pollOptionsLength <= 1) {
			return AuthorMessage.channel.send('Polling options must be greater than one.');
		}

		let PollEmbed = this.client.util.embed()
			.setTitle("Options")
			.setColor(0xD53C55)
			.setTimestamp(new Date());

		let optionsField = '';
		if (!simpleResponce) {
			for (i = 0; i < pollOptionsLength; i++) { 
				optionsField += emojiList[i] + " " + pollOptions[i] + "\n";
			}
			PollEmbed.setDescription(optionsField)
		}

		if (time)
			PollEmbed.setFooter(`The poll has started and will last ${time} minute${time !== 1 ? 's' : ''}`);
		else
			PollEmbed.setFooter(`The poll has started and has no end time`);

		let PollMessage = await AuthorMessage.channel.send(`**${question}** - by ${AuthorMessage.guild ? AuthorMessage.member.displayName : AuthorMessage.author.username}`, {embed: PollEmbed});

		let reactionArray = [];
		for (i = 0; i < pollOptionsLength; i++) { 
			reactionArray[i] = await PollMessage.react(emojiList[i]);
		}

		if (time) {
			const wait = import('util').promisify(setTimeout);
			await wait(time * 60 * 1000);

			// Re-fetch the message and get reaction counts
			PollMessage = await AuthorMessage.channel.messages.fetch(PollMessage.id)
			var reactionCountsArray = [];
			for (i = 0; i < pollOptions.length; i++) {
				reactionCountsArray[i] = PollMessage.reactions.get(emojiList[i]).count-1;
			}

			// Find winner(s)
			var max = -Infinity, indexMax = [];
			for(i = 0; i < reactionCountsArray.length; ++i) {
				if (reactionCountsArray[i] > max) {
					max = reactionCountsArray[i];
					indexMax = [i];
				} else if(reactionCountsArray[i] === max)
					indexMax.push(i);
			}

			// Display winner(s)
			let winnersText = "";
			if (reactionCountsArray[indexMax[0]] == 0) {
				winnersText = "No one voted!"
			} else {
				for (var i = 0; i < indexMax.length; i++) {
					winnersText += `${emojiList[indexMax[i]]} ${pollOptions[indexMax[i]]} (${reactionCountsArray[indexMax[i]]} vote${reactionCountsArray[indexMax[i]] !== 1 ? 's' : ''})\n`;
				}
			}

			PollEmbed.addField("**Winner(s):**", winnersText);
			PollEmbed.setFooter(`The poll is now closed! It lasted ${time} minute${time !== 1 ? 's' : ''}`);
			PollMessage.edit({embed: PollEmbed});
		}
	}
};