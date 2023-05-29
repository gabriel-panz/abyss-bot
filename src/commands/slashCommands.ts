import { ApplicationCommand, ApplicationCommandOptionType } from 'discord.js'

export enum commands {
    timer,
    raffle,
}

const commandsList = [
    {
        name: 'timer',
        description:
            'um temporizador que alerta os usuários quando chega ao fim',
        options: [
            {
                name: 'minutos',
                description: 'quantos minutos restam no timer',
                type: ApplicationCommandOptionType.Number,
                maxValue: 180,
                minValue: 1,
                required: true,
            },
            {
                name: 'role',
                description: 'a role que deve ser avisada ao final do timer',
                type: ApplicationCommandOptionType.Role,
            },
            {
                name: 'message',
                description: 'a mensagem que irá aparecer ao final do timer',
                type: ApplicationCommandOptionType.String,
            },
        ],
    },
] as ApplicationCommand[]

export default commandsList
