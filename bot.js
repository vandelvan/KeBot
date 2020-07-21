const Discord = require("discord.js");
const client = new Discord.Client();

// Event listener when a user connected to the server.
client.on("ready", () => {
  client.user
    .setActivity("Ganando KeHoot", {
      type: "STREAMING",
      url: "https://www.twitch.tv/kevin1229"
    })
    .then(console.log)
    .catch(console.error);
  console.log(`Logged in as ${client.user.tag}!`);
});

// Initialize bot by connecting to the server
client.login(process.env.BOT_TOKEN);

// bot.on('guildMemberAdd', member => {
//     member.guild.channels.get('735203148544606289').send("Welcome"); 
// });