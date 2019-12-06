export const formatStringWithChoice = (script, k, ...repl) => {
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

export const translate = (lang, key, ...repl) => {
	let languageFile = import(`./${lang}/index.js`);
	key = languageFile[key] || key;

	return formatStringWithChoice(true, key, ...repl);
}

export const backwards = (lang, translated, ...repl) => {
	let languageFile = import(`./${lang}/index.js`);

	let newKeyList = {};
	for (var key of Object.keys(languageFile))
		newKeyList[languageFile[key]] = key;

	let noTrans = newKeyList[translated] || translated;
	return formatStringWithChoice(true, noTrans, ...repl);
}

export const defaultLang = "en"

export const formatString = (k, ...v) => formatStringWithChoice(true, k, ...v)
export const formatStringObject = (k, obj) => k.replace(new RegExp("(?:(?<!\\\\){)\\s*(.*)\\s*(?:(?<!\\\\)})", "gmi"), (match, key) => obj[key])

export const getStringObject = (lang, key, ...repl) => {
	let l = import(`./${lang}/index.js`);
	let k = l[key] || key;

	return formatStringObject(k, ...repl);
}

export const getDuration = (lang, duration) => {
	const __ = k => translate(lang, k)

	let milliseconds = parseInt((duration % 1000) / 100)
	let seconds = Math.floor((duration / 1000) % 60)
	let minutes = Math.floor((duration / (1000 * 60)) % 60)
	let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
	let days = Math.floor(duration / (1000 * 60 * 60 * 24));

	let dys = __("day" + (days !== 1 ? "s" : ""));
	let hrs = __("hour" + (days !== 1 ? "s" : ""));
	let mins = __("minute" + (days !== 1 ? "s" : ""));
	let secs = __("second" + (days !== 1 ? "s" : ""));

	let dayString = "", hourString = "", minString = "", secString = "";
	if (days > 0) dayString = `${days} ${dys}, `
	if (hours > 0 || days > 0) hourString = `${hours} ${hrs}, `
	if (minutes > 0 || hours > 0 || days > 0) minString = `${minutes} ${mins} ${__("and")} `
	if (seconds > 0 || minutes > 0 || hours > 0 || days > 0) secString = `${seconds} ${secs}`

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return `${dayString}${hourString}${minString}${secString}`
}

translate.backwards = backwards;
translate.defaultLang = defaultLang
translate.formatString = formatString
translate.formatStringObject = formatStringObject
translate.formatStringWithChoice = formatStringWithChoice;
translate.getStringObject = getStringObject;
translate.getDuration = getDuration;

export default translate