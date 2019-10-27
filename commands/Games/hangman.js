const { Command } = require('discord-akairo');
const Hangman = require('hangman-game-engine');

module.exports = class HangmanCommand extends Command {
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

    createHead(points) {
        let head;
        switch (points) {
            case 1:
                head = "😁";
                break;
            case 2:
                head = "😄";
                break;
            case 3:
                head = "😅";
                break;
            case 4:
                head = "😲";
                break;
            case 5:
                head = "😬";
                break;
            case 6:
                head = "😰";
                break;
            default:
                head = '';
        }

        let structure = [];
        structure.push("```")
        structure.push("___________")
        structure.push("|     |")
        structure.push(`|     ${head}`)
        structure.push(`|    ${points > 2 ? '—' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '—' : ''}`)
        structure.push(`|    ${points > 4 ? '/' : ''} ${points > 5 ? '\\' : ''}`)
        structure.push("===========")
        structure.push("```")

        return structure.join("\n")
    }

    exec(msg, { action }) {
        const __ = (k, ...v) => global.lang.getString(msg.author.lang, k, ...v);

        const current = this.client.commandHandler.games.get(msg.author.id);
        if (current && current.name !== this.id) return msg.util.reply(__("Please wait until the current game of {0} is finished.", current.name));

        let embed = this.client.util.embed()
            .setColor("GREEN")

        let game;
        if (!current) {
            let listWords = require(`../../langs/${msg.author.lang}/hangman`);
            let word = listWords.random()
            game = new Hangman(word, {maxAttempt: 6});

            let letters = global.List.fromArray(word.split(""))
            global.List.of(letters.first, letters.last).uniq().forEach(letter => game.guess(letter))

            embed.setDescription(this.createHead(0))

            msg.util.reply(__("New word: `{0}`", game.hiddenWord.join("")), embed)
            this.client.commandHandler.games.set(msg.author.id, { name: this.id, data: game });
            return game;
        }

        game = this.client.commandHandler.games.get(msg.author.id).data;
        let message = "";

        if (action && (/[a-z]/gmi).test(action) && action !== "endgame") {
            if (game.guessedLetters.includes(action))
                message = __("You have already guessed those characters. Please pick another character to try again with")
            else {
                if (action == game.hiddenWord)
                    game.status == "WON";
                else
                    game.guess(action);

                //TODO: Display message if it was a correct guess or a wrong one
            }
        }

        if (game.status !== "IN_PROGRESS" || action == "endgame") {
            let head;

            if (game.status == "WON") {
                message = __("Congratulations! You have won the game of Hangman");
                head = this.createHead(game.failedGuesses);
            } else {
                message = __("Oh well, better luck next time");
                head = this.createHead(game.config.maxAttempt);
            }

            message += "\n" + __("The word was {0}", game.word);
            embed.setDescription(head);

            this.client.commandHandler.games.delete(msg.author.id);
            return msg.util.reply(message, {embed: embed})
        }

        const [fAtt, rAtt] = [game.failedGuesses, game.config.maxAttempt-game.failedGuesses]
        const rightGuesses = game.guessedLetters.filter(gl => game.hiddenWord.map(l => l.toLowerCase()).includes(gl))

        message += "\n`" + game.hiddenWord.join("") + "`";

        embed
            .setDescription(this.createHead(game.failedGuesses))
            .addInline(__("Right guesses ({0})", rightGuesses.length), rightGuesses.join(", ") || __("None"))
            .addInline(__("Wrong guesses ({0})", fAtt), game.guessedLetters.filter(gl => !game.hiddenWord.map(l => l.toLowerCase()).includes(gl)).join(", ") || "None")
            .addField(__("Guessed Attempts"), game.guessedLetters.join(", ") || __("None"))
            .setFooter(__("Remaining Attempts: {0}", rAtt))

        msg.util.send(message, {embed: embed})
    }
}