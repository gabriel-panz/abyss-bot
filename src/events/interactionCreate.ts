import {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
} from "discord.js";
import { commands } from "../commands/slashCommands";

let activeTimer: boolean = false

const interactionCreate = (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName == commands[commands.timer])
    timer(interaction)
      .then()
      .catch((err) => console.log(err));
};

const timer = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  if (activeTimer) {
    interaction.reply("somente um temporizador ativo é permitido!");
    return
  }
  activeTimer = true

  let minutes = Number(interaction.options.get("minutos")?.value);

  let currentMinute = 0;

  interaction.reply(
    `0 / ${minutes}, restam ${minutes - currentMinute} minutos.`
  );

  let updateTimer = setInterval(() => {
    currentMinute++;
    interaction.editReply(
      `${currentMinute} / ${minutes}, restam ${
        minutes - currentMinute
      } minutos.`
    );
    if (minutes === currentMinute) {
      interaction.editReply(`${currentMinute} / ${minutes}`);
      interaction.channel?.send(
        `${interaction.user.toString()} acabou o tempo!`
      );
      activeTimer = false;
      clearInterval(updateTimer);
    }
  }, 60000);
};

export default interactionCreate;
