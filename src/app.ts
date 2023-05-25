import { Client, IntentsBitField } from "discord.js";
import env from "dotenv";
import eventHandler from "./events/eventHandler";

env.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

eventHandler(client);
