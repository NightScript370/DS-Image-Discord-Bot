import discordAkairo from 'discord-akairo';
import { random } from "including-range-array";

const availableMoves = [
	'🤚', '✋', '🙌', '📰', '🗞', 'p', 'paper', '🙋', '🖐', // Paper
	'🖖', '✌', '✂', 'scissors', 's', // Scissors
	'rock', 'r', '🤜' // Rock
];

const rocks = ['rock', 'r', '🤜'];
const scissors = ['🖖', '✌', '✂', 'scissors', 's'];
const paper = ['🤚', '✋', '🙌', '📰', '🗞', 'p', 'paper', '🙋', '🖐'];

export default class RockPaperScissorsCommand extends discordAkairo.Command {
	constructor() {
		super('rps', {
			aliases: ['rps'],
			category: 'Games',
			description: {
				content: 'Play rock-paper-scissors with the bot.',
				usage: '<move>',
				example: ['rock', '📰', '✂']
			},
			args: [
				{
					id: 'move',
					type: availableMoves,
					prompt: {
						start: 'Pick your move!',
						retry: 'That\'s not a valid move! Try again.'
					}
				}
			],
		});
	}

	exec(msg, { move }) {
		let compare;

		if (rocks.includes(move))
			compare = 0;
		else if (paper.includes(move))
			compare = 1;
		else if (scissors.includes(move))
			compare = 2;

		let cpumove = random(2);

		if (compare == cpumove) {
			switch (compare) {
				case 1:
					msg.util.reply("It's a tie. We both picked paper.");
					break;
				case 2:
					msg.util.reply("It's a tie. We both picked scissors.");
					break;
				case 0:
					msg.util.reply("It's a tie. We both picked rock.")
			}
		} else if ((compare == 0 && cpumove == 1) || (compare == 1 && cpumove == 2) || (compare == 2 && cpumove == 0)) {
			switch (compare) {
				case 0:
					msg.util.reply("I beat you. I picked paper while you picked rock.")
					break;
				case 1:
					msg.util.reply("I beat you. I picked scissors while you picked paper.")
					break;
				case 2:
					msg.util.reply("I beat you. I picked rock while you picked scissors.")
			}
		} else if ((compare == 1 && cpumove == 0) || (compare == 2 && cpumove == 1) || (compare == 0 && cpumove == 2)) {
			switch (compare) {
				case 0:
					msg.reply("You beat me. You picked rock while I picked scissors.")
					break;
				case 1:
					msg.reply("You beat me. You picked paper while I picked rock.")
					break;
				case 2:
					msg.reply("You beat me. You picked scissors while I picked paper.")
			}
		}
	}
};