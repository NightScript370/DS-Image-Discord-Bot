const { Command } = require('discord-akairo');
const Hangman = require('hangman-game-engine');

const extra = require("./../../assets/JSON/hangman.json");


module.exports = class PickCommand extends Command {
	constructor() {
		super('hangman', {
			aliases: ['hangman', 'hman'],
			description: {
				content: "A simple yet entertaining hangman game."
			},
			category: 'Games',
			args: [
				{
					id: 'action',
					type: "lowercase",
					default: null,
				}
			]
		});
	}

	exec(msg, { action }) {
		const current = this.client.commandHandler.games.get(msg.author.id);
		if (current && current.name !== this.id) return msg.util.reply(__("Please wait until the current game of {0} is finished.", current.name));

		let embed = this.client.util.embed()
			.setColor("GREEN")

		let game;
		if (!current) {
			let word = extra.words.random()
			game = new Hangman(word, {maxAttempt: extra.heads.length});

			let letters = global.List.fromArray(word.split(""))
			global.List.of(letters.first, letters.last).uniq().forEach(letter => game.guess(letter))

			embed.setDescription(extra.heads[0])

			msg.util.reply(`New word: ${game.hiddenWord.join("")}`, embed)
			this.client.commandHandler.games.set(msg.author.id, { name: this.id, data: game });
			return game;
		}

		game = this.client.commandHandler.games.get(msg.author.id).data;
		let message = "";

		if (action && /[a-z]/gmi.test(action) && action !== "endgame") {
			if (game.guessedLetters.includes(action))
				message = "You have already guessed that letter. Please pick another letter to try again with"
			else {
				game.guess(attempt);

				//TODO: Display message if it was a correct guess or a wrong one
			}
		}

		if (game.status !== "IN_PROGRESS" || action == "endgame") {
			let head;

			if (game.status == "WON") {
				message = "Congratulations! You have won the game of Hangman";
				head = extra.heads[game.failedGuesses];
			} else {
				message = "Oh well, better luck next time";
				head = extra.heads[extra.heads.length];
			}

			message += "\n The word was " + game.word;
			embed.setDescription(head);

			this.client.commandHandler.games.delete(msg.author.id);
			return message.util.reply({embed: embed})
		}

		const [fAtt, rAtt] = [game.failedGuesses, game.config.maxAttempt-game.failedGuesses]
		const rightGuesses = game.guessedLetters.filter(gl => game.hiddenWord.map(l => l.toLowerCase()).includes(gl))

		message += "\n`" + game.hiddenWord.join("") + "`";

		embed
			.setDescription(extra.heads[game.failedGuesses])
			.addInline(`Right guesses (${rightGuesses})`, rightGuesses.join(", ") || "None")
			.addInline(`Wrong guesses (${fAtt})`, game.guessedLetters.filter(gl => !game.hiddenWord.map(l => l.toLowerCase()).includes(gl)).join(", ") || "None")
			.addField("Guessed letters", game.guessedLetters.join(", ") || "None")
			.setFooter(`Remaining Attempts: ${rAtt}`)

		msg.util.send(message, {embed: embed})
	}
}