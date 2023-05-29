import { CacheType, ChatInputCommandInteraction, Interaction } from 'discord.js'
import * as timerRepository from '../repositories/timerRepository'
import { commands } from '../commands/slashCommands'

const interactionCreate = (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName == commands[commands.timer])
        createTimer(interaction)
            .then()
            .catch((err) => console.error(err))
}

const createTimer = async (
    interaction: ChatInputCommandInteraction<CacheType>
) => {
    let steps = Number(interaction.options.get('minutos')?.value)
    let role = interaction.options.get('role')

    await interaction.reply(`0 / ${steps}, restam ${steps} minutos.`)

    interaction.fetchReply().then(
        async (r) =>
            await timerRepository.create({
                channelId: interaction.channelId,
                messageId: r.id,
                tagUser: interaction.user.toString(),
                steps: steps,
                tagRole: interaction.options.get('role')?.role?.toString(),
                messageValue: interaction.options.get('message')?.value?.toString()
            })
    )
}

export default interactionCreate
