import Command from '../../struct/Command.js';
const weather = require("util").promisify(require('weather-js').find);

module.exports = class weatherCommand extends Command {
	constructor() {
		super("weather", {
			category: 'Useful',
			aliases: ["weather", "天気"],
			description: {
				content: 'Returns the weather for the location you specify',
			},
 			args: [
				{
					id: 'area',
					description: "This is the location you would like to get weather information",
					type: async (message, area) => {
						if (!area)
							return null;

						let result = await weather({ search: area, degreeType: 'C' })
						if (isEmpty(result))
							return null;

						return result;
					},
					prompt: {
						start: "What's the location you'd like to recieve weather information for?",
						retry: "There is not a thing we can get weather information for. Try again."
					},
					match: 'content'
				},
				{
					id: 'type',
					default: null,
					type: [['C', 'celsius'], ['F', 'fahrenheit']],
					match: "option",
					flag: "type:"
				}
			]
		});
	}

	async exec (message, {area, type}) {
		if (!Array.isArray(area))
			return this.areaFound(message, area, type);

		let embed = this.client.util.embed()
			.setThumbnail('https://lh4.ggpht.com/UZpyIN2yJ5Z3Mm8FMbsjEk0mBATgzXppNiBG-1SIf9yP8lAMRMYHhI3dBEc3gj-ja94Y=w300') // What's the best weather | let's try this one
			.setColor('YELLOW') //Hmm, what color best represents weather? Yellow? | yeah oh yeah I forgot about that
			.setTitle('Yamamura Weather Search', this.client.user.displayAvatarURL())

		let result = await this.responceSelector(message, area.splice(0, 6), embed)
		if (result) return this.areaFound(message, result, type)
	}

	areaFound(message, result, type=null) {
		const __ = (k, ...v) => global.translate(message.author.lang, k, ...v)

		let temperature = "";
		if (type == "F") {
			temperature += `**${__("Temperature")}:** ${toFahrenheit(result.current.temperature)}°F\n`;
			temperature += `**${__("Feels Like")}:** ${toFahrenheit(result.current.feelslike)}°F`;
		} else if (type == "C") {
			temperature += `**${__("Temperature")}:** ${result.current.temperature}°C\n`;
			temperature += `**${__("Feels Like")}:** ${result.current.feelslike}°C`;
		} else {
			temperature += `**${__("Temperature")}:** ${result.current.temperature}°C/${toFahrenheit(result.current.temperature)}°F\n`;
			temperature += `**${__("Feels Like")}:** ${result.current.feelslike}°C/${toFahrenheit(result.current.feelslike)}°F`;
		}

		let embed = this.client.util.embed()
			.setThumbnail(result.current.imageUrl)
			.addInline(__('Timezone'), `UTC${result.location.timezone}`)
			.addInline(__("Weather"), temperature)
			.addInline(__('Winds'), result.current.winddisplay)
			.addInline(__('Humidity'), `${result.current.humidity}%`);

		message.util.send(__('{0} weather in {1}', result.current.skytext, result.current.observationpoint), message.channel.embedable ? {embed} : {});
		return result;
	}

	handleSelector(rows, index, embed=null, language=null) {
		if (embed) {
			embed.addField(`${parseInt(index)+1}. ${rows[index].current.observationpoint}`, rows[index].current.skytext);
			return embed
		}

		return `**${parseInt(index)+1}.** ${rows[index].current.observationpoint} (${rows[index].current.skytext})\n`;
	}
};

function toFahrenheit(value) {
	return (value * 1.8) + 32;
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (!value || value.length === 0);
}