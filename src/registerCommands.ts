import { ApplicationCommand, REST, Routes } from "discord.js";
import commandsList from "./commands/slashCommands";
import env from "dotenv";

env.config();

if (process.env.TOKEN === undefined)
  throw new Error("TOKEN must not be undefined");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const registerCommands = async () => {
  console.log("registering commands");
  if (process.env.CLIENT_ID === undefined)
    throw new Error("CLIENT_ID must not be undefined");

  await rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commandsList,
    })
    .then(() => console.log("commands registered successfully"))
    .catch((err) => console.log(err));
};

registerCommands().then();
