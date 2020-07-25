const Discord = require("discord.js");
const client = new Discord.Client();
const TwitchApi = require("node-twitch");
const client_id = process.env.TWITCH_CLIENT;
const secret = process.env.TWITCH_SECRET;
const api = new TwitchApi({
  client_id: client_id,
  client_secret: secret,
  isApp: true, // When this option is enabled, an application token will be automatically acquired from twitch.
});

// Initialize bot by connecting to the server
client.login(process.env.BOT_TOKEN);

// Event listener when a user connected to the server.
client.on("ready", () => {
  client.user
    .setActivity("Ganando KeHoot", {
      type: "STREAMING",
      url: "https://www.twitch.tv/kevin1229",
    })
    .then(console.log)
    .catch(console.error);
  console.log(`Logged in as ${client.user.tag}!`);
  tracker.start();
});

//Bienvenida usuarios
client.on("guildMemberAdd", (member) => {
  member.guild.channels.cache
    .get("735203148544606289")
    .send(
      "<@" +
        member +
        "> pásale a lo barrido! Aquí estarás informado cuando el Kevin esté en stream y puedes encontrar amigos para jugar juntos"
    )
    .catch((e) => console.log(e));
  //Automaticamente le da el rol de "vox populi"
  var role = member.guild.roles.cache.find(
    (role) => role.name === "Vox Populi"
  );
  member.roles.add(role).catch((e) => console.log(e));
});

api.on("ready", () => {
  const options = {
    channels: ["kevin1229"],
  };
  //Si kevin esta en vivo:
  api.getStreams(options, (body, response) => {
    var streamData = body.data[0];
    client.channels.cache
      .get("735201896779743353")
      .send(
        "@everyone El Kevin ya está stremeando `" +
          streamData.title +
          "`, Caile a verlo! https://twitch.tv/kevin1229"
      )
      .catch((e) => console.log(e));
    const attachment = new Discord.MessageAttachment(streamData.thumbnail_url);
    client.channels.cache
      .get("735201896779743353")
      .send(attachment)
      .catch((e) => console.log(e));
  });
});
