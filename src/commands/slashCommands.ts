import { ApplicationCommand, ApplicationCommandOptionType } from "discord.js";

export enum commands {
  timer,
  raffle,
}

const commandsList = [
  {
    name: "timer",
    description: "um temporizador que alerta os usuários quando chega ao fim",
    options: [{
      name: "minutos",
      description: "quantos minutos restam no timer",
      type: ApplicationCommandOptionType.Number,
      maxValue: 180,
      minValue: 1,
      required: true
    }]
  }
] as ApplicationCommand[];

export default commandsList;
