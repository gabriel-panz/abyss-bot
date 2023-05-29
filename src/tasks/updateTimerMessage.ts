import { Guild, TextChannel, ChannelType } from 'discord.js'
import TimerType from '../models/timer'
import * as timerRepository from '../repositories/timerRepository'
import moment, { duration } from 'moment'

const updateTimerMessage = async (timer: TimerType, guild: Guild) => {
    await syncSteps(timer)

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

    let now = new Date()

    if (now > timer.endDate) {
        await timerRepository.destroy(timer.id)
        if (moment(now).add(15, 'm').toDate() > timer.endDate) return

        let tags = timer.tagRole
            ? `${timer.tagUser} ${timer.tagRole}`
            : `${timer.tagUser} `
        let messageValue = timer.messageValue ?? 'hey! Acabou o tempo!'

        message.reply(`${tags} ${messageValue}`)
        return
    }

    setTimeout(async () => {
        await timerRepository.upStep(timer.id).then(() => timer.latestStep++)

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
            .finally(() => {
                if (timer.latestStep >= timer.steps) {
                    timerRepository.destroy(timer.id)
                    let tags = timer.tagRole
                        ? `${timer.tagUser} ${timer.tagRole}`
                        : `${timer.tagUser} `
                    let messageValue =
                        timer.messageValue ?? 'hey! Acabou o tempo!'

                    message.reply(`${tags} ${messageValue}`)
                }
            })
    }, timer.secondsOffset * 1000)
}

const syncSteps = async (timer: TimerType) => {
    if (timer.startDate > timer.endDate) return

    let difference = duration(
        moment(new Date()).diff(timer.startDate)
    ).asMinutes()

    let stepsTaken = Math.floor(difference / timer.stepLengthInMinutes)

    if (stepsTaken === timer.latestStep) return

    timer.latestStep = stepsTaken
    await timerRepository.upStep(timer.id, stepsTaken - timer.latestStep)
    return
}

export default updateTimerMessage
