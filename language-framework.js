global.lang = {};
global.lang.default = "en";

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    let s = target.split(search)
    return s.join(replacement);
};

global.lang.defaultData = function(userID) {
  return {
    lang: global.lang.default,
    userID: userID
  }
}

global.lang.getUser = function(client, userID) {
  return client.db.userconfig.findOne({userID: userID}) || client.db.userconfig.insert(global.lang.defaultData(userID))
}

global.lang.update = function(client, data) {
  return client.db.userconfig.update(data);
}

/* Get String function
 * Returns a string in the given language
 * Example: getString("en", "Ping: {0} ms", 400)
 */
global.getString = function(lang, key, ...repl) {
  let l;
  if (lang !== 'en') l = require(`./langs/${lang}/index.js`);
  let k = lang == "en" ? key : l[key] || key;
  
  return global.lang.formatString(k, ...repl);
}
global.lang.getString = global.getString;

global.getStringObject = function(lang, key, ...repl) {
  let l;
  if (lang !== 'en') l = require(`./langs/${lang}/index.js`);
  let k = lang == "en" ? key : l[key] || key;
  
  return global.lang.formatStringObject(k, ...repl);
}
global.lang.getStringObject = global.getStringObject;

global.lang.formatStringObject = function(k, obj) {
  console.log(obj)
  k = k.replace(new RegExp("(?:(?<!\\\\){)\\s*(.*)\\s*(?:(?<!\\\\)})", "gmi"), (match, key) => {
    console.log(key);
    return obj[key];
  })
  
  return k;
}

global.lang.formatStringWithChoice = function(script, k, ...repl) {
  // inline variables
  // & variable {key}
  // k = k.replace(/(?:(?<!\\){)\s*key\s*(?:(?<!\\)})/gmi, key)
  let i = 0
  repl.forEach(r => {
    // Escape < and >s in variables
    k = k.replaceAll(new RegExp(`(?:(?<!\\\\){)\\s*${i}\\s*(?:(?<!\\\\)})`, "gmi"), (r.toString()).replace(/((?<!\\)[<>])/g, "\\$1"))
    i++
  })

  if (script) {
    // inline scripting
    let reg = /(?:(?<!\\)<)(.*)(?:(?<!\\)>)/gmi
    let scripts = k.match(reg)
    if (scripts) {
      scripts.forEach(script => { // script => "<code>" (eg. "<1 == 1 ? 'a' : 'b'>")
        try {
          // Are you sure you need to use eval? Isn't it quite dangerous?
          // We never really open it to the end user, it's just string-wise scripting
          // Ah, I see
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

  return k;
}

global.lang.formatString = (k, ...v) => global.lang.formatStringWithChoice(false, k, ...v)

global.lang.getDuration = function(lang, duration) {
  const __ = k => global.lang.getString(lang, k)
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor(duration / (1000 * 60 * 60 * 24));

  let dys, hrs, mins, secs;
  dys = days == 1 ? __("day") : __("days");
  hrs = hours == 1 ? __("hour") : __("hours");
  mins = minutes == 1 ? __("minute") : __("minutes");
  secs = seconds == 1 ? __("second") : __("seconds");
  
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