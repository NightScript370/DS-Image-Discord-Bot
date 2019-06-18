const { Command } = require('discord-akairo');
const Game = require('hangman-game-engine');
function random(a, b = 0) {
    var max = Math.max(a, b),
        min = Math.min(a, b)
    return ~~(Math.random() * (max - min) + min)
}

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
          type: "string",
          prompt: "what are you gonna do next?",
          default: "",
        }
      ]
    });
    
    this.games = {};
  }

  exec(msg, { action }) {
    let embed = this.client.util.embed()
      .setAuthor(msg.guild ? msg.member.displayName : msg.author.username, msg.author.displayAvatarURL({format: 'png'}))

    Array.prototype.random = function() {
      return this[Math.floor(Math.random() * this.length)];
    };

    action = action.toLowerCase()
    var game;
    const key = msg.channel.id
    let shouldMove = /[a-z]/gmi.test(action)
    if (!this.games[key] || !action) shouldMove = false
    if (!shouldMove) {
      if (this.games[key]) {
        let game = this.games[key]
        const [fAtt, rAtt] = [game.failedGuesses, game.config.maxAttempt-game.failedGuesses]
        embed
          .setTitle("Showing Hangman game")
          .setDescription(`\`\`\`${game.hiddenWord.join("")}\`\`\``)
          .addInline("Failed Guesses", fAtt)
          .addInline("Remaining Attempts", rAtt)
          .addField("Guessed letters", game.guessedLetters.join(", ") || "None")
          .addInline("Right guesses", game.guessedLetters.filter(gl => game.hiddenWord.map(l => l.toLowerCase()).includes(gl)).join(", ") || "None")
          .addInline("Wrong guesses", game.guessedLetters.filter(gl => !game.hiddenWord.map(l => l.toLowerCase()).includes(gl)).join(", ") || "None")

        return msg.channel.send({embed: embed})
      }
      const words = require("./../../assets/JSON/hangman.json")
      let word = words.random()
      game = new Game(word, {maxAttempt: 6})
      
      // TODO: Set difficulty at game start
      var letters = global.List.fromArray(word.split(""))
      global.List.of(letters.first, letters.last).uniq().forEach(letter => game.guess(letter))

      embed
        .setTitle("Showing Hangman game")
        .setDescription(`\`\`\`${game.hiddenWord.join("")}\`\`\``)
      msg.channel.send({embed: embed})
      this.games[key] = game
      return
    }

    action = action[0]
    game = this.games[key]
    if (!game) return this.run(msg, {guess: "new"})
    if (game.guessedLetters.includes(action)) {
      embed
        .setColor("#FF0000")
        .setTitle("Hangman game error")
        .setDescription("You already guessed that letter.")
        .setFooter("Please pick another letter to try again with.")

      return msg.channel.send({embed: embed})
    }

    game.guess(action)
    
    if (game.status != "IN_PROGRESS") {
      return this.endgame(msg, game);
    }
    
    this.games[key] = game
    const [fAtt, rAtt] = [game.failedGuesses, game.config.maxAttempt-game.failedGuesses]
    
    let e = this.client.util.embed()
      .setTitle("Showing Hangman game")
      .setDescription(`\`\`\`${game.hiddenWord.join("")}\`\`\``)
      .addInline("Failed Guesses", fAtt)
      .addInline("Remaining Attempts", rAtt)
      .addField("Guessed letters", game.guessedLetters.join(", ") || "None")
      .addInline("Right guesses", game.guessedLetters.filter(gl => game.hiddenWord.map(l => l.toLowerCase()).includes(gl)).join(", ") || "None")
      .addInline("Wrong guesses", game.guessedLetters.filter(gl => !game.hiddenWord.map(l => l.toLowerCase()).includes(gl)).join(", ") || "None")
    
    msg.channel.send(e)
  }
  
  endgame(msg, game) {
    let e = this.client.util.embed()
      .setTitle("Hangman game results")

    let d;
    if (game.status == "WON") {
      d =`You won!\n`
    } else {
      d = `You lost!\n`
    }

    d += `\n The word was: **${game.word}**`
    e.setDescription(d)

    msg.channel.send(e)

    const key = msg.channel.id
    delete this.games[key]
  }
}