import Command from 'discord-akairo';
import { TicTacToe } from 'tictactoejs';

export default class TTTCommand extends Command {
	constructor() {
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

	1	 1,1 | 2,1 | 3,1
			---------------
	2	 1,2 | 2,2 | 3,2
			---------------
	3	 1,3 | 2,3 | 3,3

			 1		 2		 3	X
	\`\`\``
					}
				]
			},
			args: [{
				id: 'moveOrCmd',
				default: "",
				type: 'string'
			}]
		});

		this.games = [];
	}

	async exec(msg, { moveOrCmd: action }) {
		const matchRe = /([1-3])(?: )*(?:|,|\$|\-|\.|\\|\/|\||&)?(?: )*([1-3])/;

		let embed = this.client.util.embed()
			.setAuthor(msg.guild ? msg.member.displayName : msg.author.username, msg.author.displayAvatarURL({format: 'png'}))
			.setTitle("Showing Tic-Tac-Toe game")

		var games = this.games;
		var game;
		const key = msg.author.id
		const shouldMove = matchRe.test(action) // matches "1,3", "1, 3", "1|3" and "13"
		if (!shouldMove || (shouldMove && !this.games[key])) {
			action = this.games[key] ? "grid" : "new"
			if (action == "new") {
				if (this.games[key]) return msg.reply("a game with your name is already in progress. Finish that first!")
				this.games[key] = new TicTacToe()

				embed.setTitle('New Tic-Tac-Toe game')
			}

			embed.setDescription('```' + games[key].ascii() + '```')
			return msg.util.send({embed: embed});
		}
		game = games[key]

		if (game.status() != "in progress") {
			// client.ttt.status.delete(msg.author.id)
			return this.deleteGame(msg, key)
		}

		// where is matchRe defined?
		// On top of the class definition
		var parsed = matchRe.exec(action);
		var [column, row] = [parsed[1], 4 - parseInt(parsed[2])];
		game.turn(); // first move will be X
		game.move(column, row);

		games[key] = game;

		if (game.status() != "in progress")
			return this.deleteGame(msg, key);

		game.turn();
		game.randomMove();

		games[key] = game;

		if (game.status() != "in progress")
			return this.deleteGame(msg, key);

		games[key] = game;
		embed
			.setDescription('```' + game.ascii() + '```');
		msg.channel.send({embed: embed});
	}
	
	checkStatus(status) {
		return (status != "draw" ? (status == "X" ? "X (you) won!" : "O (the AI) won!") : "It's a draw!");
	}
	
	deleteGame(msg, key) {
		let embed = this.client.util.embed()
			.setAuthor(msg.guild ? msg.member.displayName : msg.author.username, msg.author.displayAvatarURL({format: 'png'}))
			.setTitle("Tic-Tac-Toe game results")
			.setDescription(this.checkStatus(this.games[key].status()) + ' **```' + this.games[key].ascii() + '```**')
		msg.util.send(embed)

		if (this.games[key])
			delete this.games[key]
	}
};