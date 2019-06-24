module.exports = {
  token: process.env.TOKEN,
  DBLtoken: process.env.DBLTOKEN,
  DBLPass: process.env.DBLPASS,
  url: `https://${process.env.DOMAIN}`,
  owners: process.env.OWNERS,
  prefix: process.env.PREFIX,
  logging: process.env.LOGCHAN,
}
