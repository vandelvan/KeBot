const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
const client_id = process.env.TWITCH_CLIENT;
const secret = process.env.TWITCH_SECRET;

async function getToken() {
  const token = await axios.post(
    "https://id.twitch.tv/oauth2/token?client_id=" +
      client_id +
      "&client_secret=" +
      secret +
      "&grant_type=client_credentials"
  );
}
console.log(getToken());
const helix = axios.create({
  baseURL: "https://api.twitch.tv/helix/",
  headers: { "Client-ID": client_id, Authirization: "Bearer" },
});

const kraken = axios.create({
  baseURL: "https://api.twitch.tv/kraken/",
  headers: { "Client-ID": client_id },
});

// helix
//   .get("channels?broadcaster_id=44445592")
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch((e) => console.log(e));

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
