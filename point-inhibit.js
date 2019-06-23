function inhibite (message) {
    if(message.cleanContent.length <= 2) return true;
	return spamchannel(message.channel.name) || blockprefix(message);
}

function blockprefix (message) {
    // While we're not trying to block all bot prefixes, this function is served to block most bots on its own without the use of a config file
	// (that would be impossible, cause some of them can be actual words or used in beginning of phrases
	// plus there are thousands upon thousands of bots out there)
	// TODO: Allow server-set bot prefixes

		let block = false;

		const prefixes = [
			// First list global bot prefixes
			'!', // Mee6
			'%', // Logger
			't!', // Tatsumaki
			'p!', // Pokebot & Pika.py
			'e!', // Endless
			'#!', // Discord.RPG
			';', // Kariari & FredBoat
			'>>', // Vortex
			'a!', 'a@', // Alice
			'x!', // Xen
			'd!', // DadBot
			'wp!', // WikiPulse
			'h:', // Homer
			"f'", // Focabot
			'rp!', // RPG Bot
			'g*', // GameROB
    		'cli$', // Clinet

			// Bots I found on Plexi Development deserves it's own spot in the list, simply cause there are more than 100 bots on the server
			'/', // Avery
			'b//', // Beta
			'f!', // FireBAsic
			'dlm!', // DLM
			'<', // Exodus
			'pb!', // Plexi Bots
			'co!', // Contestor
			'RJ.', // RoboJack
			'L.', // Logger

			// Now for user made bots
			'k!', // Koopa (Samplasion)
			'm:', // MoonlightBot (MoonlightCapital)
			'o!', // Le bot De odyssey (Tee)
			'b!', // bepisBot (trainboy2019)
			'r~', // reflect (superwhiskers)
			'm~', // Markov-Bot (superwhiskers)

			// Finally, guild specific cases
			't@', // Tatsumaki (Super Mario Maker: Vanilla Revamped)
			'd?', // Dyno (Super Mario Maker: Vanilla Revamped)
			'n!', // Nadeko (Double Cherry Studios/Mushroom Universe/Super Star Studios)
			'i:' // Endless (open-shop)
		];

		for (var prefix of prefixes) {
			if(message.content.indexOf(prefixes) == 0)
				block = true;
		}

		return block;
}

function spamchannel(channelName) {
		let listNoPointNames = [
			// First lets block spam channels
    		'featherland', // Mario Making Mods
			'end-of-server', // NightYoshi's Hub
			'edge-of-the-server', //sks chillzone
			'spam', // Generic Spam channel
			'dank-memes', // RHCafe
			'weegee-gallery', // (Double Cherry Studios/Mushroom Universe/Super Star Studios)
			'memes', // MashiBro's server, Skawo's server, dev/null
			'spamhere', // TWL Mode Hacking!
			'memes-and-shitposting', // Power Star Frenzy
			'shitposting', // YAMMS
			'end-of-the-world', // YAMMS
			'purging-spamroom', // YAMMS
			'mirage-saloon-zone', // NightYoshi Island
			'spam-bot-commands', // Game Chat Network
			'shootposting', // Super Mario Maker: Vanilla Revamped (its a meme from EddieMoron)
			'waluigi-time', // 1-Up World
			'memes-and-shitposts', // r/MarioMaker
			'meme-madness', // Power Star Plaza
			'memery', // Newer DX
			'glorious-spam', // Newer DX
			'glorious-memes', //Newer DX
			'trash', // SMBNext
			'toad-posting',
			'bunnyposting',

			// Now block Bot command channels
			'bot-fun', // Old Mario Making Mods
			'bots', // NintenFans
			'land-of-bots', // MashiBro's server
			'music-lab', // NightYoshi Island
			'bot-spam', // Project Pokemon
			'bot-testing', // Plexi Development
			'bot-testing-2', // Plexi Development
			'chat-bots', // Mario Unimaker
			'bots-and-commands', // Power Star Frenzy
			'riptos-lava-toilet', // Gatete Gaming
    		'ex-bot',
    		'chat-commands',
			'bot', // Gatete Gaming
			'bot-uno', // Gatete Gaming
			'bot-mayhem', // Power Star Plaza
			'music-hub', // Power Star Plaza
			'sp500mkll', // Sonic Mania Modding
			'bot-stuff', // 1-Up World
			'robotic-operating-buddy', // 1-Up World
			'bot-commands', // Yukiko
			'botspam', // Pretendo
			'loss-free-zone', // Jul
			'mecha-koopa-commands', // (Double Cherry Studios/Mushroom Universe/Super Star Studios)
			'botcmds', // dev/null
			'commands', // BurritoSOFTWARE
			'bot-cmds', // Nintendo Homebrew
    		'ex-bots', // Super Mario Network
    		'private-bot-testing', // NightYoshi Hub
    		'private-bot-usage', // NightYoshi Hub
    		'private-bot-hub', // NightYoshi Hub
    		'bot-yamamura',
			'bot-channel',
			'testing',
			'bot-zeph',
			'bot-blocc',
			'play_with_bot',
			'play_with_bots',
			'commands-testing',
			'bot-channel-no-embeds',
			'bots-2',
			'bots-nsfw',
			'testing-1',
			'testing-2',
			'bot-errors',
			'bot-chamber',
			'cmds-n-docs',
			'botspam-and-other-spam',

			// Now for voice chat channels
			'voice-chat', // Programming server
			'vc-companion', // Power Star Plaza
			'voice-text', // Let Me Level With You
			'no-mic-chat', // MayroSMM
			'voice-and-gaming', // 1-Up World
			'voice', // Pika
			'no-mic', // Skawo's server, SMBNext, Newer DX
			'no_mic_vc', // MashiBro's server
			'text-talk', // Power Star Frenzy
			'no-mic-n-music', // dev/null
			'voice-dump',

			// While the following channels aren't really spam channels, they will be ignored cause they are bots that connect to other servers.
			// If the other user can't get points (due to them being in a different guild), why should the user on this guild get points too?
			'megachat', // Reflect
			'phonebook', // sks Chillzone (Yggdrasil)
			'your-escape-phoneline' // NightYoshi island (Yggdrasil)
		];

		for (var spamchannel of spamchannels) {
			if(channel == spamchannel)
				return true;
		}

		return false;
}

module.exports = {
	inhibite,
	blockprefix,
	spamchannel
}