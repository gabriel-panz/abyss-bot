import { Client } from "discord.js";
import ready from "./ready";
import interactionCreate from "./interactionCreate";

const eventHandler = (client: Client<boolean>) => {
  client.on("ready", ready);

  client.on("interactionCreate", interactionCreate);

  client.login(process.env.TOKEN);
};

export default eventHandler;
