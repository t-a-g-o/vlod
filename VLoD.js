const { Collection, Intents, Client } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(``);
  }
}



client.once('ready', () => {
  console.log(`Logged in: ${client.user.tag}`);
  console.log('Thank you for trying my Validating Licenses on Discord bot project! For more information or help visit the github page: https://github.com/t-a-g-o/vlod. You can change the status of the bot in the config.json file');
  console.log('\n');
  console.log('REMEMBER: You need to run service.py in order to keep the accounts registered online!')
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: 'licenses',
      type: 'WATCHING' // 'PLAYING', 'WATCHING', 'LISTENING', 'STREAMING'
    }]
  });
});



client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
client.login(token);