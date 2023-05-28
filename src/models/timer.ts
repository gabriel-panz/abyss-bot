type TimerType = {
    id: string
    steps: number
    stepLengthInMinutes: number
    latestStep: number
    startDate: Date
    endDate: Date
    channelId: string
    messageId: string
    tagUser: string
}

export default TimerType
