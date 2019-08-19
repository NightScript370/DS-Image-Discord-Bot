const passport = require("passport");
const CheckAuth = require('./isAuth');
let parameters = (req) => {
  return { profile: (req.isAuthenticated() ? "/profile" : "/login") }
}

module.exports = (app, client) => app
  .get("/", (request, response) => response.render("index", parameters(request)))
  .get("/login", passport.authenticate("discord", { failureRedirect: "/" }), (request, response) => response.redirect("/profile"))
  .get("/logout", async (request, response) => {
    await req.logout();
    await res.redirect("/");
  })
  .get("/leaderboard", (request, response) => response.render("leaderboard", Object.assign(parameters(request), { url: request.originalUrl, id: undefined, user: (request.isAuthenticated() ? request.user.id : null) })))
  .get("/leaderboard/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.redirect("/leaderboard");

    response.render("leaderboard", Object.assign(parameters(request), { id }));
  })
  .get("/queue/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.status(404).render("pages/404");

    response.render("queue", Object.assign(parameters(request), { id }));
  })
  .get("/commands", (request, response) => response.render("commands", parameters(request)))
  .get("/support", (request, response) => {
    let object = parameters(request)
    object.widgets = [
      {
        website: 'discordbotlist.com',
        imageurl: `https://discordbotlist.com/bots/${client.user.id}/widget`,
        link: `https://discordbotlist.com/bots/${client.user.id}`,
        size: {
          width: 380,
          height: 150
        }
      },
      {
        website: 'discordbots.org',
        imageurl: `https://discordbots.org/api/widget/${client.user.id}.svg?usernamecolor=FFFFFF&topcolor=000000`,
        link: `https://discordbots.org/bot/${client.user.id}`
      },
      {
        website: 'discord.boats',
        imageurl: `https://discord.boats/API/V2/widget/${client.user.id}`,
        link: `https://discord.boats/bot/${client.user.id}`
      }
    ];
    response.render("support", object)
  })
  .get('*', (request, response) => response.redirect("/"));
