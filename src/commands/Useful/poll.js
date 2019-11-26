const { Command } = require('discord-akairo')

module.exports = class PollCommand extends Command {
	constructor() {
		super("poll", {
			aliases: ['poll', 'vote'],
			category: 'Useful',
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
						infinite: true
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
		let description = ''; // placeholder for now

		let simpleResponce = false;
		let emojiList = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];

		if (pollOptions[0] == "yesno") {
			simpleResponce = true;
			emojiList = ['👍','👎','🤷'];
			pollOptions = ['Yes', 'No', 'Shrug'];
		} else if (pollOptions.length <= 1) {
			return AuthorMessage.channel.send('Polling options must be greater than one.');
		}

		let PollEmbed = this.client.util.embed()
			.setTitle(question)
			.setDescription(description)
			.setAuthor(AuthorMessage.author.username, AuthorMessage.author.displayAvatarURL({format: 'png'}))
			.setColor(0xD53C55)
			.setTimestamp(new Date());

		let optionsField = '';
		if (!simpleResponce) {
			for (var i = 0; i < pollOptions.length; i++) { 
				optionsField += emojiList[i] + " " + pollOptions[i] + "\n";
			}
			PollEmbed.addField('Options', optionsField)
		}

		if (time)		PollEmbed.setFooter(`The poll has started and will last ${time} minute(s)`);
		else				 PollEmbed.setFooter(`The poll has started and has no end time`);

		let PollMessage = await AuthorMessage.channel.send({embed: PollEmbed});

		var reactionArray = [];
		for (var i = 0; i < pollOptions.length; i++) { 
			reactionArray[i] = await PollMessage.react(emojiList[i]);
		}

		if (time) {
			setTimeout(async () => {
				// Re-fetch the message and get reaction counts
				PollMessage = await AuthorMessage.channel.messages.fetch(PollMessage.id)
				var reactionCountsArray = [];
				for (var i = 0; i < pollOptions.length; i++) {
					reactionCountsArray[i] = PollMessage.reactions.get(emojiList[i]).count-1;
				}

				// Find winner(s)
				var max = -Infinity, indexMax = [];
				for(var i = 0; i < reactionCountsArray.length; ++i) {
					if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
					else if(reactionCountsArray[i] === max) indexMax.push(i);
				}

				// Display winner(s)
				let winnersText = "";
				if (reactionCountsArray[indexMax[0]] == 0) {
					winnersText = "No one voted!"
				} else {
					for (var i = 0; i < indexMax.length; i++) {
						winnersText += emojiList[indexMax[i]] + " " + pollOptions[indexMax[i]] + " (" + reactionCountsArray[indexMax[i]] + " vote(s))\n";
					}
				}

				PollEmbed.addField("**Winner(s):**", winnersText);
				PollEmbed.setFooter(`The poll is now closed! It lasted ${time} minute(s)`);
				PollMessage.edit({embed: PollEmbed});
			}, time * 60 * 1000);
		}
	}
};