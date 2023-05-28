import { DataTypes, Model, Sequelize } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'
import TimerType from '../models/timer'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './src/database/db.sqlite',
})

export const Timer = sequelize.define<Model<TimerType, TimerType>>('Timer', {
    id: {
        primaryKey: true,
        type: DataTypes.UUIDV4,
        allowNull: false,
        defaultValue: uuidV4(),
    },
    steps: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 20,
    },
    stepLengthInMinutes: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 1,
    },
    latestStep: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tagUser: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secondsOffset: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
})

export default sequelize
