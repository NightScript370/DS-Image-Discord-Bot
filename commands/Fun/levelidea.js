const Command = require('../../struct/Command');
const List = require('list-array');

module.exports = class LevelIdeaCommand extends Command {
	constructor() {
		super('level-idea', {
			aliases: ['levelidea', 'level-idea'],
			category: 'Fun',
			description: {
        content: 'Get an idea for your next Super Mario Maker 2 level.'
      },
      args: [
        {
          id: 'smm2',
          description: 'Determine if you want ideas from SMM2 as well',
          match: 'flag',
          flag: '--smm2'
        }
      ],
		});
	}

	async exec(message, { smm2 }) {
    let phrase = this.levelIdea()
    message.util.send(phrase)
	}

  levelIdea(smm2) {
    Array.prototype.random = function() {
      return this[Math.floor(Math.random() * this.length)];
    };

    let playerList = ["Mario"];
    let playerList2 = ["Luigi", "Toad", "Toadette"]

    let adjectives = [
      "infested",
      "haunted",
      "claustrophobic",
      "spacious",
      "frozen",
      "overgrown",
      "sunken",
      "collapsing",
      "coin-filled",
      "abandoned",
      "simple",
      "burning",
      "flying",
      "sandy",
    ];
    let verbs = [
      "explore",
      "traverse",
      "hurry through",
      "sneak into",
      "sneak out of",
      "sneak through",
      "destroy",
      "clear out",
    ];
    let places = [
      "plain",
      "garden",
      "ocean",
      "submarine",
      "mansion",
      "airship",
      "armada",
      "cave",
      "mine",
      "lake",
      "forest",
      "castle",
      "tower",
      "cloudscape",
      "desert",
      "tundra",
      "mountain",
      "village",
      "factory",
      "temple",
      "ruin",
      "pipe land",
      "maze",
    ];
    let features = [
      "brick blocks",
      "question blocks",
      "donut blocks",
      "fire flowers",
      "hidden blocks",
      "springs",
      "goombas",
      "piranha plants",
      "cheep cheeps",
      "koopas",
      "semisolids",
      "doors",
      "launchers",
      "boos",
      "dry bones",
      "hammer bros",
      "pipes",
      "thwomps",
      "lava bubbles",
      "coins",
      "conveyor belts",
      "spinies",
      "POW blocks",
      "ice blocks",
      "keys",
      "cloud blocks",
      "bobombs",
      "block blocks",
      "super mushrooms",
      "P switches",
      "spike tops",
      "lifts",
      "flimsy lifts",
      "vines",
      "mushroom platforms",
      "skewers",
      "Bowser",
      "propeller mushrooms",
      "capes",
      "tanooki leaves",
      "giant mushrooms",
      "bloopers",
      "magikoopas",
      "stars",
      "skull rafts",
      "tracks",
      "chain chomps",
      "fire bars",
      "one-ways",
      "cannons",
      "wigglers",
      "burners",
      "Yoshis",
      "goomba shoes",
      "saws",
      "spike traps",
      "munchers",
      "buzzy beetles",
      "note blocks",
      "lakitus",
      "clown cars",
      "rocky wrenches",
      "monty moles",
      "swinging claws",
      "snake blocks",
      "ON/OFF switches",
      "seesaws",
      "parachutes",
      "banzai bills",
      "dry bones shells",
      "big coins",
      "Boom Boom",
      "icicles",
      "Bowser Junior",
      "pink coins",
      "the angry sun",
      "the moon",
    ];
    let features3d = [
      "brick blocks",
      "question blocks",
      "donut blocks",
      "fire flowers",
      "hidden blocks",
      "springs",
      "goombas",
      "piranha plants",
      "cheep cheeps",
      "koopas",
      "semisolids",
      "doors",
      "launchers",
      "boos",
      "dry bones",
      "hammer bros",
      "pipes",
      "thwomps",
      "lava bubbles",
      "coins",
      "conveyor belts",
      "spinies",
      "POW blocks",
      "ice blocks",
      "keys",
      "cloud blocks",
      "bobombs",
      "block blocks",
      "super mushrooms",
      "P switches",
      "ant troopers",
      "lifts",
      "flimsy lifts",
      "Meowser",
      "cat bells",
      "bloopers",
      "magikoopas",
      "stars",
      "koopas in cars",
      "snake blocks",
      "ON/OFF switches",
      "seesaws",
      "parachutes",
      "banzai bills",
      "big coins",
      "Boom Boom",
      "icicles",
      "clear pipes",
      "crates",
      "warp boxes",
      "spike blocks",
      "! blocks",
      "blinking blocks",
      "track blocks",
      "piranha creepers",
      "charvaargh",
      "pink coins",
      "Pom Pom",
      "bullies",
    ];
    
    const build = (player, verb, adjective, place, features) => {
      let a = ["a", "e", "i", "o", "u"].includes(adjective.substr(0, 1)) ? "an" : "a";
      
      // Nice way to get a random 3 or 4 elements
      let f = List.fromArray(features).shuffle();
      f.length = Math.random() > 0.5 ? 4 : 3;
      
      return `${player} must ${verb} ${a} ${adjective} ${place}, featuring ${global.List.fromArray(features).random()}, supported by ${f.joinAnd()}`
    }

    if (smm2)
      playerList.concat(playerList2)

    return build(playerList.random(), verbs.random(), adjectives.random(), places.random(), Math.random() > 0.8 ? features3d : features)
  }
};