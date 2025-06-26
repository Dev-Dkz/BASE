require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

const {PermissionsBitField, Permissions, MessageManager, Embed, Role } = require(`discord.js`);
const { Events } = require('discord.js');
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");
const sqlite3 = require('sqlite3').verbose();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildIntegrations, 
    GatewayIntentBits.GuildWebhooks, 
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.DirectMessageTyping, 
    GatewayIntentBits.GuildModeration, 
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks, 
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.GuildScheduledEvents, 
    GatewayIntentBits.GuildMessageTyping, 
    GatewayIntentBits.AutoModerationExecution, 
  ],
  partials: [
    Partials.GuildMember, 
    Partials.Channel,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction, 
    Partials.ThreadMember, 
    Partials.User
  ],
});

client.setMaxListeners(0);


client.commands = new Collection(); 
client.slashCommands = new Collection(); 

client.login(process.env.BOT_TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});

// Outros códigos...