module.exports = function(app, client) {
  app
    .get("/", (request, response) => {
      response.render("pages/index");
    })
    .get("/leaderboard", (request, response) => {
      response.render("pages/leaderboard", { url: request.originalUrl, id: undefined });
    })
    .get("/leaderboard/:guildID", (request, response) => {
      let id = request.params.guildID;
      if (!id || !client.guilds.has(id)) return response.status(404).render("pages/404");
      response.render("pages/leaderboard", { id });
    })
    .get("/queue/:guildID", (request, response) => {
      let id = request.params.guildID;
      if (!id || !client.guilds.has(id)) return response.status(404).render("pages/404");
      response.render("pages/queue", { id });
    })
    .get("/commands", (request, response) => {
      response.render("pages/commands");
    })
    .get("/support", (request, response) => {
      response.render("pages/support");
    })
    .get('*', function(req, res) {
      res.redirect("/");
    });

  return app;
}