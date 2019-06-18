const { Command } = require('discord-akairo');
const { oneLine } = require('common-tags');
const { TicTacToe } = require('tictactoejs');

module.exports = class TTTCommand extends Command {
  constructor(client) {
    super("tictactoe", {
      category: 'Games',
      aliases: ["ttt", "tris", "xandos", 'tictactoe'],
      clientPermissions: ['EMBED_LINKS'],
      memberName: 'ttt',
      description: {
        content: `Play some "Tic-Tac-Toe" with Yamamura!`,
        examples: ['ttt', "ttt 3,1", "ttt new"],
        usage: 'tictactoe ["new"|"grid"|your move]',
        fields: [
          {
            name: "details",
            value: `Also known as "Tris". To move your sign the command is \`tictactoe <column or X><separator><row or Y>\`.`
          },
          {
            name: "Grid",
            value: `\`\`\`
  Y

  1   1,1 | 2,1 | 3,1
      ---------------
  2   1,2 | 2,2 | 3,2
      ---------------
  3   1,3 | 2,3 | 3,3

       1     2     3	X
  \`\`\``
          }
        ]
      },
      args: [{
        id: 'moveOrCmd',
        default: "",
        /*
        prompt: {
          start: "Where would you like to put your \"X\", or, if you wanna do something, what?",
          retry: "That's not a valid grid location. Please try again"
        },
        */
        type: 'string'
      }]
    });
    
    this.games = [];
    this.examples = ['ttt', "ttt 3,1", "ttt new"];
    this.details = oneLine;
  }

  async exec(msg, { moveOrCmd: action }) {
    let name = msg.member ? msg.member.displayName : msg.author.username;
    const client = await this.client;
    const matchRe = /([1-3])(?: )*(?:|,|\$|\-|\.|\\|\/|\||&)?(?: )*([1-3])/;

    let games = this.games;
    var game;
    const key = `${msg.author.id}`
    const shouldMove = matchRe.test(action) // matches "1,3", "1, 3", "1|3" and "13"
    if (!shouldMove || (shouldMove && !games[key])) {
      action = games[key] ? "grid" : "new"
      if (action == "new") {
        if (games[key]) return msg.reply("a game is already in progress. Finish that first!")
        game = new TicTacToe()
        let e = client.util.embed()
          .setAuthor(name, msg.author.displayAvatarURL({format: 'png'}))
          .setTitle("Showing Tic-Tac-Toe game")
          .setDescription(`\`\`\`${game.ascii()}\`\`\``)
        msg.channel.send(e)
        games[key] = game
      } else if (action == "grid") {
        let e = client.util.embed()
          .setAuthor(name, msg.author.displayAvatarURL)
          .setTitle("Showing Tic-Tac-Toe game")
          .setDescription(`\`\`\`${games[key].ascii()}\`\`\``)
        msg.channel.send(e)
      }
      return
    }
    game = games[key]
    
    if (game.status() != "in progress") {
      // client.ttt.status.delete(msg.author.id)
      return this.deleteGame(msg, key)
    }
    
    // where is matchRe defined?
    // On top of the class definition
    var parsed = matchRe.exec(action)
    // console.log(matchRe, parseInt(action), parsed)
    var [column, row] = [parsed[1], 4-parseInt(parsed[2])]
    game.turn(); // first move will be X
    game.move(column, row);
    
    games[key] = game
    
    if (game.status() != "in progress") {
      // client.ttt.status.delete(msg.author.id)
      return this.deleteGame(msg, key)
    }
    
    game.turn()
    game.randomMove()
    
    games[key] = game
    
    if (game.status() != "in progress") {
      // client.ttt.status.delete(msg.author.id)
      return this.deleteGame(msg, key)
    }
    
    games[key] = game
    let e = client.util.embed()
      .setAuthor(name, msg.author.displayAvatarURL)
      .setTitle("Showing Tic-Tac-Toe game")
      .setDescription(`\`\`\`${game.ascii()}\`\`\``)
    msg.channel.send(e)
  }
  
  checkStatus(game) {
    let d = ""
    if (game.status() != "draw") {
      if (game.status() == "X") {
        d +=`X (you) won!`
      } else {
        d += `O (the AI) won!`
      }
    } else {
      d +=`It's a draw!`
    }
    return d;
  }
  
  deleteGame(msg, key) {
    let game = this.games[key];
    delete this.games[key]
    let e = this.client.util.embed()
      .setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
      .setTitle("Tic-Tac-Toe game results")
    let d = this.checkStatus(game);
    d +=`\`\`\`${game.ascii()}\`\`\``
    e.setDescription(d)
    return msg.channel.send(e)
  }
};