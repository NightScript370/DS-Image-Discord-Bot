import { Listener } from 'discord-akairo';

export default class rateLimitListener extends Listener {
    constructor() {
        super('rateLimit', {
            emitter: 'client',
            event: 'rateLimit',
            category: 'botHandler'
        });
    }

    exec(rateLimitObj) {
		console.log(`Rate limit reached!\nTimeout: ${rateLimitObj.timeout}\nLimit: ${rateLimitObj.limit}\n` +
					`TimeDiff: ${rateLimitObj.timeDifference}\nMethod: ${rateLimitObj.method}\nPath: ${rateLimitObj.path}\n` +
					`Route: ${rateLimitObj.route}`);
	}
};