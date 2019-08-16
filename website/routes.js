const passport = require("passport");
let parameters = {
  profile: (req.isAuthenticated() ? "/profile" : "/login")
}

module.exports = (app, client) => app
  .get("/", (request, response) => response.render("index", parameters))
  .get("/login", passport.authenticate("discord", { failureRedirect: "/" }), (request, response) => response.redirect("/profile", parameters))
  .get("/logout", async (request, response) => {
    await req.logout();
    await res.redirect("/");
  })
  .get("/leaderboard", (request, response) => response.render("leaderboard", Object.assign(parameters, { url: request.originalUrl, id: undefined })))
  .get("/leaderboard/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.redirect("/leaderboard");

    response.render("leaderboard", Object.assign(parameters, { id }));
  })
  .get("/queue/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.status(404).render("pages/404");

    response.render("queue", Object.assign(parameters, { id }));
  })
  .get("/commands", (request, response) => response.render("commands", parameters))
  .get("/support", (request, response) => response.render("support", parameters))
  .get('*', (request, response) => response.redirect("/"));
