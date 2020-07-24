import { ApiClient } from 'twitch';
import { StaticAuthProvider } from 'twitch-auth';
const Discord = require("discord.js");
const client = new Discord.Client();
const clientId = process.env.TWITCH_CLIENT;
const accessToken = process.env.TWITCH_TOKEN;
const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });

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
  console.log(isStreamLive());
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

//Checamos si kevin esta live
async function isStreamLive() {
	const user = await apiClient.helix.users.getUserByName("kevin1229");
	if (!user) {
		return false;
	}
	return await apiClient.helix.streams.getStreamByUserId(user.id) !== null;
}
