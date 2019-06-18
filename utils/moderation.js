const ban = require('./moderation/ban')
const kick = require('./moderation/kick')
const mute = require('./moderation/mute')
const warn = require('./moderation/warn')

module.exports = {
  mute,
  ban,
  kick,
  warn
}