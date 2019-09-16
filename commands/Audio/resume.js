const { Command } = require('discord-akairo');

module.exports = class ResumeCommand extends Command {
    constructor() {
        super('resume', {
            aliases: ['resume', '再開'],
            category: 'Audio',
            description: {
                content: 'Resume the currently paused audio.'
            },
            channelRestriction: 'guild',
        });
    }

    exec(message) {
        const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);

        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.util.reply(__("in order to use audio commands, you will need to be in a voice channel"));

        let fetched = this.client.audio.active.get(message.guild.id);
        if (!fetched)
            return message.util.reply(__("in order to resume audio, there needs to be audio playing in the channel"));

        if (!fetched.dispatcher.paused)
            return message.util.reply(__("there is nothing to resume playing: you should be listening to it right now"));

        fetched.dispatcher.resume();
        return message.util.reply(__("I have successfully resumed {0}.", fetched.queue[0].songTitle));
    }
}