import { Command } from 'discord-akairo';
import questions from "./../../assets/JSON/sort-hat";

export default class SortingHatCommand extends Command {
	constructor() {
		super('sorting-hat', {
			aliases: ['sorting-hat', 'sort-hat', "sorthat"],
			category: 'Fun',
			description: {
				content: 'Which Hogwarts house will you be placed in?'
			}
		});
	}

	async exec(msg) {
		if (!this.client.isOwner(msg.author.id))
			return msg.channel.send("Sorry, but this is a Work In Progress command. This will not work")

		let emojiList = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];
		let reactionArray = [];

		let points = {
			gryffindor: 0,
			ravenclaw: 0,
			hufflepuff: 0,
			slytherin: 0
		}

		let answered = {}
		for (var i = 0; i < Object.keys(questions).length; i++) {
			answered[i] = false;
		}

		let loopamount = 0;
		while (Object.values(answered).filter(value => value == true) !== 0 && loopamount <= Object.keys(questions).length) {
			loopamount++;
		}
	}
};