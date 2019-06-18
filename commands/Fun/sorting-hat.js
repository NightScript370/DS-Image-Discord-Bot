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
      "1.) You are given a test at school that has questions that teacher hasn't covered yet. In the middle of the test you notice that your friend next to you has a cheat-sheet. The teacher doesn't notice.": [
        "Ask to share the cheat-sheet. This test isn't fair, so why should you be?",
        "Good for them, they beat the system.",
        "Confront them after the test and try to convince them not to cheat anymore. You don't want them to get in trouble.",
        "Confront them after the test and force them to tell the teacher they cheated, or you will tell on them. They must pay for their misdeeds.",
        "Inform the teacher right in the middle of class that they are cheating. Cheaters never prosper!"
      ],
      "2.) While walking down the street you see a wallet on the side of the road. It has a small amount of money in it, but no identification of any kind. There is nobody in sight.": [
        "Leave it there. Someone is probably looking for it.",
        "Pocket the money. You don't know who it belongs to, so finder's keepers.",
        "Take it to the police in case anyone ever reports it.",
        "Take the wallet, and go around the area asking anyone if they have lost a wallet recently."
      ],
      "3.) Someone has played a prank on you which involves your public embarrassment and everyone begins laughing at you. However, you doubt they meant any harm by it.": [
        "Laugh along with the crowd. You love a good joke even if it's at your expense.",
        "On the outside you'll laugh because you don't want anyone to know that they really hurt your feelings by making you look stupid in front of everybody.",
        "You get upset and run away from the crowd. How could they be so mean?",
        "That jerk! You get mad right away and tell it to their face.",
        "Pretend that all is well, but you won't forget this. They're going to pay for what they did! How dare they publicly humiliate you."
      ],
      "4.) You have arrived late to work because you had a flat tire. You've been on time every other day for the past month, yet your boss yells at you about it in front of all your coworkers.": [
        "Endure his yelling, he is my boss after all.",
        "Let him yell, it doesn't matter anyway, you're not listening.",
        "Explain to him that accidents happen and that you don't feel you need to be yelled at because of it.",
        "Yell right back at him! How dare he insult you for something so petty.",
        "Allow him to yell all he wants, you'll just let the air out of his tires someday."
      ],
      "5.) You have just returned home from a long day's work when a friend calls you and explains that they are stranded on a back road an hour drive from town and they need you to pick them up. They've already tried everyone else and you are their only means of getting back.": [
        "I'm too tired. Tell them to try to flag down a car to help them out.",
        "I'm too tired. Make up a lie about why you can't help them.",
        "I'll do it, but I'm charging them for gas money.",
        "Yes, I'm tired, but what are friends for?",
        "Ask them what's wrong with the car. Maybe you can talk them through how to fix it."
      ],
      "6.) A little kid accuses you, in front of a whole crowd people, of stealing his toy which you did not do. You are twice his size, but he won't back off.": [
        "How dare he insult me in front of all these people? I'll show him how things work in the real world!",
        "Explain to him that I didn't take his toy and give him fair warning that he'll have a black eye if he doesn't drop it.",
        "Try to rationalize with the kid. Tell him you didn't take the toy and refuse to fight him even if he takes a few swings at you.",
        "Tell him you didn't take the toy and direct him to someone who can help him find it.",
        "Explain to him you didn't take the toy and offer to personally help find the person who did."
      ],
      "7.) You have saved up for months to buy a new bike. As you're getting ready to buy it, a child runs by and steals your money. You chase him down and find that his mother is deathly ill and the child stole the money to buy her medicine.": [
        "That's their problem, I didn't get the lady sick. I worked hard for that money and it's mine.",
        "Perhaps you would have helped them if they were to ask, but you don't help thieves.",
        "Maybe I'll let them keep some of the money and buy the bike later.",
        "They are obviously in need of the money more than I. I give it all to them.",
        "I'll give them the money and try and nurse the mother back to health.",
        "Refuse to give them your money, but still try and nurse the mother back to health."
      ],
      "8.) A friend of yours tells you that there is some really cool stuff in an old abandoned building. When you get there you see a sign that \"Danger: Do not enter!\", but the building doesn't look dangerous. There is nobody around to see you, and your friend wants to check it out.": [
        "Obviously there is some dangerous stuff in there, and we shouldn't be going inside.",
        "Maybe I'll just take a peek inside for a little while. What could it hurt?",
        "Danger shmanger! There's probably some cool stuff inside. Let's see what all the fuss is about."
      ],
      "9.) A very strong man approaches you while you're eating lunch and demands that you give him some food. He doesn't appear to be starving or poor. There is nobody there to stop him from taking it.": [
        "Give him some food and leave quickly. You don't want any trouble from a jerk like that.",
        "Give him some food and leave. But you're going to tell on him later.",
        "Give him some food and follow him to his house so you can later get him back by doing something rather nasty.",
        "Give him half your food and invite him to sit and talk with you, maybe you can befriend him.",
        "Give him a nice fist in the face. Nobody steals from you."
      ],
      "10.) You have inherited a large sum of money from your great aunt.": [
        "Put it all into a savings account and spend it wisely as needs present themselves.",
        "Buy a few things right away. Maybe a new car, a boat, a house, etc. The rest I'll put away for a rainy day.",
        "Spend it all on something really big and eccentric. You can't take it with you right?",
        "Donate it to the sick, injured, and poor.",
        "Donate it to science, research, and development.",
        "Invest it into the market. You'll soon have even more!"
      ],
      "11.) You are given a small plastic puzzle that looks to be difficult to solve.": [
        "I have better things to do than play with toys.",
        "I'll try it out, but if I can't solve it, it's not the end of the world.",
        "I'll put some time into it. I'm sure I could solve it eventually.",
        "I won't give up until I solve it. Then, maybe I'll try it blindfolded!"
      ],
      "12.) Five years ago a girl stole some money from you and she never got in trouble for it. Since then, she has become a much better person. Recently she has been arrested for stealing, but you can prove that she is innocent.": [
        "I'm not saying a thing. This is the punishment that she never got five years ago.",
        "Tell her that I'll save her, provided she pays me back the money she owes me.",
        "I'll save her because I know she's a better person now.",
        "I'd save her even if she was still a bad person because I know she is innocent this time."
      ]
    }
	}

	async exec(msg, { move }) {
    var emojiList = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];
    let reactionArray = [];

    let GryffindorPoints = 0;
    let RavenClawPoints = 0;
    let HufflePuffPoints = 0;
    let SlytherinPoints = 0;

    return msg.reply('Sorry, this is a WIP command');
    let question1 = this.embed(1);
    let embed = await msg.channel.send(question1.embed);
    for (var i = 0; i < question1.responces; i++) {
      reactionArray[i] = await embed.react(emojiList[i]);
    }
    
    const filter = (reaction, user) => {
      console.log(reaction, user)
      return true// reaction.emoji.name === '👌' && user.id === message.author.id;
    }

    embed.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
      .then(collected => console.log(collected.size))
      .catch(collected => {
        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
      });

    GryffindorPoints += this.HandleGryffindor(1, /* responce reaction he picked */);
    HufflePuffPoints += this.HandleHufflePuff(1, /* responce reaction he picked */);
	}
  
  /*
  embed
    .setTitle('')
    .setDescription(`:one:
:two:
:three:
:four:
:five:
`)
  */
  embed(question) {
    let embed = this.client.util.embed()
      .setDescription("Please report to the Yamamura Development Server"); // Will be overridden by the one below
    let responces = 0;

    switch (question) {
      case 1:
        responces = 5;
        embed
          .setTitle('You are given a test at school that has questions that teacher has not covered yet. In the middle of the test you notice that your friend next to you has a cheat-sheet. The teacher does not notice.')
          .setDescription(`:one: Ask them to share the cheat-sheet. This test isn't fair, so why should you be?
:two: Good for them, they beat the system.
:three: Confront them after the test and try to convince them not to cheat anymore. You don't want them to get in trouble.
:four: Confront them after the test and force them to tell the teacher they cheated, or you will tell on them. They must pay for their misdeeds.
:five: Inform the teacher right in the middle of class that they are cheating. Cheaters never prosper!
`)
    }
    return {embed, responces};
  }
  
  HandleGryffindor(question, reply) {
    let addedPoints = 0;

    switch (question) {
      case 1:
      case 2:
        switch (reply) {
          case 1:
          case 2:
          case 3:
            addedPoints = 1;
        }
        break;
      case 3:
        switch (reply) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            addedPoints = 1;
        }
        break;
      case 4:
        switch (reply) {
          case 2:
          case 3:
            addedPoints = 2;
        }
        break;
      case 5:
        switch (reply) {
          case 1:
          case 3:
          case 4:
          case 5:
            addedPoints = 1;
        }
        break;
      case 6:
        switch (reply) {
          case 1:
          case 2:
            addedPoints = 2;
            break;
          case 4:
          case 5:
            addedPoints = 1;
        }
        break;
      case 7:
        switch (reply) {
          case 1:
          case 2:
        }
    }

    return addedPoints;
  }
  
  HandleSlytherin(question, reply) {
    let addedPoints = 0;

    switch (question) {
      case 1:
        switch (reply) {
          case 1:
            addedPoints = 2;
            break;
          case 2:
            addedPoints = 1;
        }
    }

    return addedPoints;
  }
  
  HandleHufflePuff(question, reply) {
    let addedPoints = 0;

    switch (question) {
      case 1:
        switch (reply) {
          case 3:
          case 4:
          case 5:
            addedPoints = 1;
        }
    }

    return addedPoints;
  }

  HandleRavenclaw(question, reply) {
    let addedPoints = 0;

    switch (question) {
      case 1:
        switch (reply) {
          case 3:
          case 5:
            addedPoints = 1;
            break;
          case 4:
            addedPoints = 2;
        }
    }

    return addedPoints;
  }
};