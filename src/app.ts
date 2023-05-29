import { ChannelType, Client, IntentsBitField, TextChannel } from 'discord.js'
import env from 'dotenv'
import eventHandler from './events/eventHandler'
import sequelize from './database/sequelize'
import cron from 'node-cron'
import * as timerRepository from './repositories/timerRepository'
import updateTimerMessage from './tasks/updateTimerMessage'

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

    const guild = client.guilds.cache.get(String(process.env.GUILD_ID))
    if (!guild) return

    timers.forEach(async (timer) => await updateTimerMessage(timer, guild))
})

eventHandler(client)
