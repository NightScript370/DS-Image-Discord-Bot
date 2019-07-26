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
            let fetchedUser = client.users.fetch(vote.user);
            message = `${fetchedUser.tag} just upvoted!`;
        } catch(e) {
            message = `${vote.user} upvoted`;
        }

        this.client.channels.get(this.client.log.upvote).send(message);
        console.log(`[DiscordBots.org] User with ID ${vote.user} just voted!`);
    }
}