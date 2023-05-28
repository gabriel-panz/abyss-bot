import { ChannelType, Client, IntentsBitField, TextChannel } from 'discord.js'
import env from 'dotenv'
import eventHandler from './events/eventHandler'
import sequelize from './database/sequelize'
import cron from 'node-cron'
import * as timerRepository from './repositories/timerRepository'

env.config()
sequelize.sync()

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

cron.schedule('* * * * *', async () => {
    let timers = await timerRepository.getAll()
    if (timers.length === 0) return

    timers.forEach(async (timer) => {
        const guild = client.guilds.cache.get(String(process.env.GUILD_ID))
        if (!guild) return

        const channel = guild.channels.cache.find(
            (c) => c.id === timer.channelId && c.type === ChannelType.GuildText
        ) as TextChannel

        if (!channel) {
            timerRepository.destroy(timer.id!)
            return
        }

        let message = await channel.messages.fetch(timer.messageId)

        if (!message) {
            timerRepository.destroy(timer.id)
            return
        }

        setTimeout(async () => {
            await timerRepository
                .upStep(timer.id)
                .then(() => timer.latestStep++)

            if (timer.latestStep === timer.steps) {
                timerRepository.destroy(timer.id)
                message.edit(`${timer.tagUser} hey! Acabou o tempo!`)
            } else {
                channel.messages
                    .fetch(timer.messageId)
                    .then((message) => {
                        message.edit(
                            `${timer.latestStep}/${timer.steps}, restam ${
                                timer.steps! - timer.latestStep!
                            } minutes.`
                        )
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        }, timer.secondsOffset * 1000)
    })
})

eventHandler(client)
