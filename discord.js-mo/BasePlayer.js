'use strict';

const EventEmitter = require('events').EventEmitter;
const stream = require('stream');
const prism = require('prism-media');
const StreamDispatcher = require('../dispatcher/StreamDispatcher');

const FFMPEG_ARGUMENTS = {
  DEFAULT: [
    '-analyzeduration', '0',
    '-loglevel', '0',
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
  ],
  OGGOPUS: bitrate => [
    '-analyzeduration', '0',
    '-loglevel', '0',
    '-acodec', 'libopus',
    '-b:a', `${bitrate}K`,
    '-f', 'opus',
    '-ar', '48000',
    '-ac', '2',
  ],
};

/**
 * An Audio Player for a Voice Connection.
 * @private
 * @extends {EventEmitter}
 */
class BasePlayer extends EventEmitter {
  constructor() {
    super();
    this.dispatcher = null;
    this.streamingData = { channels: 2, sequence: 0, timestamp: 0 };
  }

  destroy() {
    this.destroyDispatcher();
  }

  destroyDispatcher() {
    if (this.dispatcher) {
      this.dispatcher.destroy();
      this.dispatcher = null;
    }
  }

  playUnknown(input, options) {
    const pipeline = new Map();
    const isFFmpegOpus = options.volume === false && prism.FFmpeg.load().info.includes('--enable-libopus');

    let bitrate;
    if (options.bitrate) {
      bitrate = options.bitrate;
    } else if (this.voiceConnection && this.voiceConnection.channel) {
      bitrate = this.voiceConnection.channel.bitrate / 1000;
    }

    const args = isFFmpegOpus ? [...FFMPEG_ARGUMENTS.OGGOPUS(bitrate || 48)] : [...FFMPEG_ARGUMENTS.DEFAULT];

    if (input instanceof stream.Readable) {
      pipeline.set('input', input);
    } else {
      args.unshift('-i', input);
    }
    if (options.seek) args.unshift('-ss', String(options.seek));

	if (isFFmpegOpus) {
      pipeline.set('ffmpeg', new prism.FFmpeg({ args }).pipe(new prism.opus.OggDemuxer()));
      return this.playOpusStream(pipeline, options);
    } else {
      pipeline.set('ffmpeg', new prism.FFmpeg({ args }));
      return this.playPCMStream(pipeline, options);
    }
  }

  playPCMStream(pipeline, options) {
    if (options && options.volume !== false) {
      pipeline.set('volume', new prism.VolumeTransformer({ type: 's16le', volume: options ? options.volume : 1 }));
    }
    const encoder = new prism.opus.Encoder({ channels: 2, rate: 48000, frameSize: 960 });
    pipeline.set('opus:encoder', encoder);
    return this.playOpusStream(pipeline, options);
  }

  playOpusStream(pipeline, options) {
    // If the user has not opted out of volume and there isn't already a volume transform stream, make one
    if (options.volume !== false && !pipeline.has('volume')) {
      pipeline.set('opus:decoder', new prism.opus.Decoder({ channels: 2, rate: 48000, frameSize: 960 }));
      pipeline.set('volume', new prism.VolumeTransformer({ type: 's16le', volume: options ? options.volume : 1 }));
      pipeline.set('opus:encoder', new prism.opus.Encoder({ channels: 2, rate: 48000, frameSize: 960 }));
    }
    return this.createDispatcher(options, pipeline);
  }

  createDispatcher(options, pipeline, broadcast) {
    this.destroyDispatcher();
    const dispatcher = this.dispatcher = new StreamDispatcher(this, options, pipeline, broadcast);
    pipeline.set('dispatcher', dispatcher);
    // eslint-disable-next-line no-empty-function
    const noop = () => {};
    stream.pipeline(...pipeline.values(), noop);
    return dispatcher;
  }
}

module.exports = BasePlayer;
