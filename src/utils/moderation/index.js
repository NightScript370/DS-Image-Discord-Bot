import ban from './ban.js'
import kick from './kick.js'
import mute from './mute.js'
import warn from './warn.js'

let moderationModules = {}
moderationModules.ban = ban
moderationModules.kick = kick
moderationModules.mute = mute
moderationModules.warn = warn

module.exports = moderationModules