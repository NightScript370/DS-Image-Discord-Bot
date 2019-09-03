module.exports = {
  token: process.env.TOKEN,
  DBLtoken: process.env.DBLTOKEN,
  DBLPass: process.env.DBLPASS,
  url: `https://${process.env.DOMAIN}`,
  owners: [
    "178261738364338177",
    "305817665082097665",
    "280399026749440000",
    "175408504427905025"
  ],
  prefix: process.env.PREFIX,
  log: {
    servers: process.env.LOGCHAN,
    upvote: "604381257656172603",
    errors: "592610001265229837"
  }
};
