const { Command } = require('discord-akairo');

module.exports = class SortingHatCommand extends Command {
	constructor() {
		super('sorting-hat', {
			aliases: ['sorting-hat', 'sort-hat', "sorthat"],
			category: 'Fun',
			description: {
				content: 'Which Hogwarts house will you be placed in?'
			}
		});
		
		this.questions = {
			"You are given a test at school that has questions that teacher hasn't covered yet. In the middle of the test you notice that your friend next to you has a cheat-sheet. The teacher doesn't notice.": {
				"Ask to share the cheat-sheet. This test isn't fair, so why should you be?": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Good for them, they beat the system.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Confront them after the test and try to convince them not to cheat anymore. You don't want them to get in trouble.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Confront them after the test and force them to tell the teacher they cheated, or you will tell on them. They must pay for their misdeeds.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Inform the teacher right in the middle of class that they are cheating. Cheaters never prosper!": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"While walking down the street you see a wallet on the side of the road. It has a small amount of money in it, but no identification of any kind. There is nobody in sight.": {
				"Leave it there. Someone is probably looking for it.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Pocket the money. You don't know who it belongs to, so finder's keepers.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Take it to the police in case anyone ever reports it.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Take the wallet, and go around the area asking anyone if they have lost a wallet recently.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"Someone has played a prank on you which involves your public embarrassment and everyone begins laughing at you. However, you doubt they meant any harm by it.": {
				"Laugh along with the crowd. You love a good joke even if it's at your expense.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"On the outside you'll laugh because you don't want anyone to know that they really hurt your feelings by making you look stupid in front of everybody.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"You get upset and run away from the crowd. How could they be so mean?": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"That jerk! You get mad right away and tell it to their face.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Pretend that all is well, but you won't forget this. They're going to pay for what they did! How dare they publicly humiliate you.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"You have arrived late to work because you had a flat tire. You've been on time every other day for the past month, yet your boss yells at you about it in front of all your coworkers.": {
				"Endure his yelling, he is my boss after all.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Let him yell, it doesn't matter anyway, you're not listening.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Explain to him that accidents happen and that you don't feel you need to be yelled at because of it.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Yell right back at him! How dare he insult you for something so petty.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Allow him to yell all he wants, you'll just let the air out of his tires someday.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"You have just returned home from a long day's work when a friend calls you and explains that they are stranded on a back road an hour drive from town and they need you to pick them up. They've already tried everyone else and you are their only means of getting back.": {
				"I'm too tired. Tell them to try to flag down a car to help them out.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'm too tired. Make up a lie about why you can't help them.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'll do it, but I'm charging them for gas money.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Yes, I'm tired, but what are friends for?": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Ask them what's wrong with the car. Maybe you can talk them through how to fix it.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"A little kid accuses you, in front of a whole crowd people, of stealing his toy which you did not do. You are twice his size, but he won't back off.": {
				"How dare he insult me in front of all these people? I'll show him how things work in the real world!": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Explain to him that I didn't take his toy and give him fair warning that he'll have a black eye if he doesn't drop it.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Try to rationalize with the kid. Tell him you didn't take the toy and refuse to fight him even if he takes a few swings at you.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Tell him you didn't take the toy and direct him to someone who can help him find it.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Explain to him you didn't take the toy and offer to personally help find the person who did.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"You have saved up for months to buy a new bike. As you're getting ready to buy it, a child runs by and steals your money. You chase him down and find that his mother is deathly ill and the child stole the money to buy her medicine.": {
				"That's their problem, I didn't get the lady sick. I worked hard for that money and it's mine.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Perhaps you would have helped them if they were to ask, but you don't help thieves.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Maybe I'll let them keep some of the money and buy the bike later.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"They are obviously in need of the money more than I. I give it all to them.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'll give them the money and try and nurse the mother back to health.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Refuse to give them your money, but still try and nurse the mother back to health.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"A friend of yours tells you that there is some really cool stuff in an old abandoned building. When you get there you see a sign that \"Danger: Do not enter!\", but the building doesn't look dangerous. There is nobody around to see you, and your friend wants to check it out.": {
				"Obviously there is some dangerous stuff in there, and we shouldn't be going inside.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Maybe I'll just take a peek inside for a little while. What could it hurt?": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Danger shmanger! There's probably some cool stuff inside. Let's see what all the fuss is about.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"A very strong man approaches you while you're eating lunch and demands that you give him some food. He doesn't appear to be starving or poor. There is nobody there to stop him from taking it.": {
				"Give him some food and leave quickly. You don't want any trouble from a jerk like that.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Give him some food and leave. But you're going to tell on him later.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Give him some food and follow him to his house so you can later get him back by doing something rather nasty.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Give him half your food and invite him to sit and talk with you, maybe you can befriend him.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Give him a nice fist in the face. Nobody steals from you.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"You have inherited a large sum of money from your great aunt.": {
				"Put it all into a savings account and spend it wisely as needs present themselves.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Buy a few things right away. Maybe a new car, a boat, a house, etc. The rest I'll put away for a rainy day.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Spend it all on something really big and eccentric. You can't take it with you right?": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Donate it to the sick, injured, and poor.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Donate it to science, research, and development.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Invest it into the market. You'll soon have even more!": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"You are given a small plastic puzzle that looks to be difficult to solve.": {
				"I have better things to do than play with toys.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'll try it out, but if I can't solve it, it's not the end of the world.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'll put some time into it. I'm sure I could solve it eventually.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I won't give up until I solve it. Then, maybe I'll try it blindfolded!": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			},
			"Five years ago a girl stole some money from you and she never got in trouble for it. Since then, she has become a much better person. Recently she has been arrested for stealing, but you can prove that she is innocent.": {
				"I'm not saying a thing. This is the punishment that she never got five years ago.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"Tell her that I'll save her, provided she pays me back the money she owes me.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'll save her because I know she's a better person now.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				},
				"I'd save her even if she was still a bad person because I know she is innocent this time.": {
					gryffindor: 0,
					slytherin: 0,
					hufflepuff: 0,
					ravenclaw: 0
				}
			}
		}
	}

	async exec(msg, { move }) {
		if (!client.isOwner(msg.author.id))
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
		for (var i = 0; i < Object.keys(this.questions).length; i++) {
			answered[i] = false;
		}

		let loopamount = 0;
		while (Object.values(answered).filter(value => value == true) !== 0 && loopamount <= Object.keys(this.questions).length) {
			loopamount++;
		}
	}
};