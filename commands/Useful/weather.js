const { Command } = require('discord-akairo');
const weather = require(`weather-js`);

const { promisify } = require("util");
const asyncWeather = promisify(weather.find);

module.exports = class weatherCommand extends Command {
    constructor() {
        super("weather", {
            category: 'Useful',
            aliases: ["weather"],
            clientPermissions: ['EMBED_LINKS'],
            description: {
                content: `Returns the weather for the location you specify`,
            },
 	        args: [
                {
                    id: 'area',
                    description: "This is the location you would like to get weather information",
                    type: 'string',
                    prompt: {
                        start: "What's the location you'd like to recieve weather information for?",
                        retry: "There is not a thing we can get weather information for. Try again."
                    },
                    match: 'content'
                }
            ]
        });
    }

    async exec(message, { area }) {
        let result = asyncWeather({ search: area, degreeType: 'C' }); 
        if (isEmpty(result)) {
            return message.channel.send("There were no results found for your location. Please try again later.");
        }

        let current = result[0].current;
        let location = result[0].location;

        let embed = this.client.util.embed
            .setThumbnail(current.imageUrl)
            .addInline('Timezone', `UTC${location.timezone}`)
            .addInline('Degree Type', location.degreetype)
            .addInline('Temperature', `${current.temperature} Degrees`)
            .addInline('Feels Like', `${current.feelslike} Degrees`)
            .addInline('Winds', current.winddisplay)
            .addInline('Humidity', `${current.humidity}%`);
        message.channel.send(`${current.skytext} weather in ${current.observationpoint}`, message.channel.embedable ? {embed} : {});

        return result;
    }
};