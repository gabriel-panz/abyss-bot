import { CacheType, Interaction } from "discord.js";

const interactionCreate = (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;
};

export default interactionCreate;
