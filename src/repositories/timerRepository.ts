import { Timer } from '../database/sequelize'
import TimerType from '../models/timer'
import { v4 as uuidV4, validate as validateUuid } from 'uuid'
import moment from 'moment'
import { Model } from 'sequelize'

export const create = async (timer: {
    channelId: string
    messageId: string
    tagUser: string
    steps?: number
    stepLengthInMinutes?: number
    startDate?: Date
    tagRole?: string
    messageValue?: string
}): Promise<Model<any, any>> => {
    let startDate = timer.startDate ?? new Date()
    let endDate = moment(new Date())
        .add(
            // calculates it based on the amount of steps * step length
            (timer.stepLengthInMinutes ?? 1) * (timer.steps ?? 20), 'm'
        )
        .toDate()

    return await Timer.create({
        id: uuidV4(),
        latestStep: 0,
        steps: timer.steps ?? 20,
        stepLengthInMinutes: timer.stepLengthInMinutes ?? 1,
        startDate: startDate,
        endDate: endDate,
        channelId: timer.channelId,
        messageId: timer.messageId,
        messageValue: timer.messageValue,
        tagUser: timer.tagUser,
        tagRole: timer.tagRole,
        secondsOffset: moment(startDate).second(),
    })
}

/**
 * Deletes the specified timer
 * @param timerId must be uuid
 * @returns the number of affected rows
 */
export const destroy = async (timerId: string): Promise<number> => {
    if (!validateUuid(timerId)) throw Error(`${timerId} is not a valid uuidV4`)
    return await Timer.destroy({
        where: {
            id: timerId,
        },
    })
}

export const getAll = async (): Promise<TimerType[]> => {
    return await Timer.findAll().then((values) =>
        values.map((model) => model.dataValues)
    )
}

/**
 * Adds to the steps taken to conclude one timer
 * @param timerId uuid
 * @param steps the number of steps to add, default = 1
 * @returns the number of affected rows
 */
export const upStep = async (
    timerId: string,
    steps: number = 1
): Promise<number> => {
    let timer = await Timer.findOne({
        where: {
            id: timerId,
        },
    })

    if (timer === null) throw Error(`Id: ${timerId} not found`)

    let result = await Timer.update(
        {
            latestStep: timer.dataValues.latestStep! + steps,
        },
        {
            where: {
                id: timer.dataValues.id,
            },
        }
    )
    return result[0]
}
