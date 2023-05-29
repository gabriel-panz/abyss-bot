type TimerType = {
    id: string
    steps: number
    stepLengthInMinutes: number
    latestStep: number
    startDate: Date
    endDate: Date
    channelId: string
    messageId: string
    messageValue?: string
    tagUser: string
    tagRole?: string
    secondsOffset: number
}

export default TimerType
