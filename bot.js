const Discord = require("discord.js");
const client = new Discord.Client();
const client_id = process.env.TWITCH_CLIENT;
const { TwitchOnlineTracker } = require("twitchonlinetracker");
const tracker = new TwitchOnlineTracker({
  client_id: client_id, // used for api requests
  track: ["kevin1229"], // all the channels you want to track
  debug: true, // whether to debug to console
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

// Listen to live event, it returns StreamData
tracker.on("live", (streamData) => {
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
// Make sure you listen for errors
tracker.on("error", (error) => console.error);
