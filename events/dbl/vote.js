const { Listener } = require('discord-akairo');

module.exports = class DBLVotedListener extends Listener {
    constructor() {
        super('vote', {
            emitter: 'dblwebhook',
            event: 'vote',
            category: 'dbl'
        });
    }

    exec(vote) {
        if (vote.type == 'test')
            return console.log('test successful');
        let message;

        try {
            let fetchedUser = this.client.users.fetch(vote.user);
            message = `${fetchedUser.tag} just upvoted on DiscordBots.org!`;
        } catch(e) {
            message = `${vote.user} upvoted on DiscordBots.org`;
        }

        this.client.channels.get(this.client.log.upvote).send(message);
        console.log(`[DiscordBots.org] User with ID ${vote.user} just voted!`);
    }
}