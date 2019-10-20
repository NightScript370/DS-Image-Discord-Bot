const formatStringWithChoice = (script, k, ...repl) => {
	// inline variables
	// & variable {key}
	// k = k.replace(/(?:(?<!\\){)\s*key\s*(?:(?<!\\)})/gmi, key)
	let i = 0
	repl.forEach(r => {
		// Escape < and >s in variables
		k = k.replaceAll(new RegExp(`(?:(?<!\\\\){)\\s*${i}\\s*(?:(?<!\\\\)})`, "gmi"), (r.toString()).replace(/((?<!\\)[<>])/g, "\\$1"))
		i++
	})
	
	k = k.replace(/(?<!\\)<:(.*):(\d*)(?<!\\)>/gmi, "\\<:$1:$2\\>");

	try {
		if (script) {
			// inline scripting
			let reg = /(?:(?<!\\)<)(.*)(?:(?<!\\)>)/gmi;
			if ("object" == typeof k) k = Object.values(k)[0]; // Get the first available string (bad practice, but eh)
			let scripts = k.match(reg)
			if (scripts) {
				scripts.forEach(script => { // script => "<code>" (eg. "<1 == 1 ? 'a' : 'b'>")
					try {
						k = k.replace(script, eval(script.replace(/[<>]/gmi, "")))
					} catch (e) {
						console.log(script);
						console.error(e);
					}
				})
			}

			// Revert the escaped < and >s to normal
			k = k.replace(/\\([<>])/g, "$1")
		}
	} catch (err) {
		console.error(err);
		console.log(k)
	}
	
	k = k.replace(/\\<:(.*):(\d*)\\>/gmi, "<:$1:$2>");

	return k;
}

const translate = (lang, key, ...repl) => {
	let languageFile = require(`./${lang}/index.js`);
	key = languageFile[key] || key;

	return formatStringWithChoice(true, key, ...repl);
}

translate.defaultLang = "en"

translate.formatStringWithChoice = formatStringWithChoice;
translate.formatString = (k, ...v) => formatStringWithChoice(true, k, ...v)
translate.formatStringObject = (k, obj) => k.replace(new RegExp("(?:(?<!\\\\){)\\s*(.*)\\s*(?:(?<!\\\\)})", "gmi"), (match, key) => obj[key])

translate.getStringObject = (lang, key, ...repl) => {
	let l;
	if (lang !== 'en') l = require(`./${lang}/index.js`);
	let k = lang == "en" ? key : l[key] || key;

	return translate.formatStringObject(k, ...repl);
}

translate.getDuration = (lang, duration) => {
	const __ = k => translate.getString(lang, k)
	var milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
		days = Math.floor(duration / (1000 * 60 * 60 * 24));

	let dys, hrs, mins, secs;
	dys = days == 1 ? __("day", 1) : __("days", days);
	hrs = hours == 1 ? __("hour", 1) : __("hours", hours);
	mins = minutes == 1 ? __("minute", 1) : __("minutes", minutes);
	secs = seconds == 1 ? __("second", 1) : __("seconds", seconds);
  
	let dayString = "", hourString = "", minString = "", secString = "";
	if (days > 0) dayString = `${days} ${dys}, `
	if (hours > 0 || days > 0) hourString = `${hours} ${hrs}, `
	if (minutes > 0 || hours > 0 || days > 0) minString = `${minutes} ${mins} ${__("and")} `
	if (seconds > 0 || minutes > 0 || hours > 0 || days > 0) secString = `${seconds} ${secs}`

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
  
	// console.log(days, hours, minutes, seconds, dayString, hourString, minString, secString)
	return `${dayString}${hourString}${minString}${secString}`
}

module.exports = translate;