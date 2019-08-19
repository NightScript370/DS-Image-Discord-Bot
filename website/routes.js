const passport = require("passport");
const CheckAuth = require('./isAuth');
let parameters = (req, client) => {
  return {
    profile: (req.isAuthenticated() ? "/profile" : "/login"),
    inviteBot: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`
  }
}

module.exports = (app, client) => app
  .get("/", (request, response) => {
    let object = parameters(request, client)
    object.features = [
      {
        icon: "level-up",
        text: "Leveling system",
        subtext: "with configurable point multipliers"
      },
      {
        icon_html: `<div style="display: flex; justify-content: center;align-items: center;"><div class="three-cogs fa-1x">
          <i class="fa fa-cog fa-spin fa-2x fa-fw"></i>
          <i class="fa fa-cog fa-spin fa-1x fa-fw"></i>
          <i class="fa fa-cog fa-spin fa-1x fa-fw"></i>
        </div></div>`,
        text: "Customizable settings system",
        subtext: "to suit each different server"
      },
      {
        icon: "star",
        text: "Starboard system"
      },
      {
        icon: "file-code-o",
        text: "Over 100 fun and helpful commands",
        subtext: "with new ones added daily"
      },
      {
        icon: "music",
        text: "Listen to audio from Youtube",
        subtext: "with support for playlists"
      },
      {
        icon: "users",
        text: "A helpful and interactive community",
        subtext: "willing to help"
      }
    ]
    response.render("index", object)
  })
  .get("/login", passport.authenticate("discord", { failureRedirect: "/" }), (request, response) => response.redirect("/profile"))
  .get("/logout", async (request, response) => {
    await request.logout();
    await response.redirect("/");
  })
  .get("/leaderboard", (request, response) => response.render("leaderboard", Object.assign(parameters(request, client), { url: request.originalUrl, id: undefined, user: (request.isAuthenticated() ? request.user.id : null) })))
  .get("/leaderboard/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.redirect("/leaderboard");

    response.render("leaderboard", Object.assign(parameters(request, client), { id }));
  })
  .get("/queue/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.status(404).render("pages/404");

    response.render("queue", Object.assign(parameters(request, client), { id }));
  })
  .get("/commands", (request, response) => response.render("commands", parameters(request, client)))
  .get("/support", (request, response) => {
    let object = parameters(request, client)
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
