const { Command } = require('discord-akairo');

module.exports = class PauseAudioCommand extends Command {
    constructor() {
        super('pause', {
            aliases: ['pause', '一時停止'],
            category: 'Audio',
            description: {
                content: 'Pause the currently playing audio.'
            },
            channelRestriction: 'guild'
        });
    }

    exec(message) {
        const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);

        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.util.reply(__("in order to use audio commands, you will need to be in a voice channel"));

        let fetched = this.client.audio.active.get(message.guild.id);
        if (!fetched)
            return message.util.reply(__("in order to pause audio, there needs to be audio playing in the channel"));

        if (fetched.dispatcher.paused)
            return message.util.reply(__("the audio that you are currently supposed to be listening to is already paused"));

        fetched.dispatcher.pause();
        return message.util.reply(__("I have successfully paused {0}.", fetched.queue[0].songTitle));
    }
};