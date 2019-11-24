import ban from './ban'
import kick from './kick'
import mute from './mute'
import warn from './warn'

let moderationModules = {}
moderationModules.ban = ban
moderationModules.kick = kick
moderationModules.mute = mute
moderationModules.warn = warn

export default moderationModules