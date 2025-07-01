const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Keep-alive ping endpoint
app.get("/", (req, res) => res.send("Luxcrypt bot is alive."));
app.listen(port, () => console.log(`🌐 Web server running on port ${port}`));

const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.GuildMember]
});

const config = {
  token: process.env.TOKEN,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  leaveChannelId: process.env.LEAVE_CHANNEL_ID,
  autoRoleId: process.env.AUTO_ROLE_ID
};

client.once('ready', () => {
  console.log(`🛡️ Luxcrypt Welcomer is online as ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get(config.welcomeChannelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor('#7b75ff')
    .setTitle('🛬 Welcome to Luxcrypt')
    .setDescription(`🔐 <@${member.id}> has entered the vault.

➡️ Read <#rules>
💬 Say hi in <#general>
🧪 Test in <#launcher-dev>`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Access logged and granted' });

  channel.send({ content: `<@${member.id}>`, embeds: [embed] });

  const role = member.guild.roles.cache.get(config.autoRoleId);
  if (role) member.roles.add(role).catch(console.error);
});

client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.get(config.leaveChannelId);
  if (!channel) return;
  channel.send(`⚠️ <@${member.id}> has left Luxcrypt. Vault access revoked.`);
});

client.login(config.token);
