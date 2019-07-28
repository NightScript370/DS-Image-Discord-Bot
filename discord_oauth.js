const express = require('express');
const request = require('node-superfetch');
const btoa = require('btoa');
const catchAsync = fn => (
  (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  }
);

function data(client) {
  const router = express.Router();
  
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const redirect = encodeURIComponent(`https://${process.env.PROJECT_DOMAIN}.glitch.me/api/discord/callback`);

  router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=identify&response_type=code&redirect_uri=${redirect}`);
  });
  
  router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${client.user.id}:${CLIENT_SECRET}`);
    const responce = await request
        .post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`)
        .set("Authorization", `Basic ${creds}`)
    const json = await response.json();
    let usernameObj = await request
      .get(`https://discordapp.com/api/users/@me`)
      .set("Authorization", `Bearer ${json.access_token}`)
    let username = await usernameObj.json();

    req.session.loggedin = true;
		req.session.userID = username.id;
    res.redirect(`/leaderboard?userID=${username.id}`);
  }));
  
  return router;
}

module.exports = data;