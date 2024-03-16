import { engine } from "@dcl/sdk/ecs";

export class ScheduleManager {
    updateFrequency: number = 1
    currentUpdateTime: number = 0
    scheduleList: Schedule[] = []
    static instance: ScheduleManager

    constructor() {
        ScheduleManager.instance = this
        engine.addSystem(this.update.bind(this))
    }

    private update(_dt: number) {
        this.currentUpdateTime += _dt
        if (this.currentUpdateTime >= this.updateFrequency) {
            this.currentUpdateTime = 0
            this.checkSchedule()
        }
    }

    registerSchedule(schedule: Schedule) {
        this.scheduleList.push(schedule)
    }

    private checkSchedule() {
        let currentDate: number = Date.now()

        this.scheduleList.forEach(scheduleItem => {
            if (scheduleItem.startTime < currentDate && scheduleItem.endTime > currentDate && !scheduleItem.startCallbackFired) {
                scheduleItem.startCallbackFired = true
                try {
                    scheduleItem.startCallback()
                } catch (error) {
                    console.log("Error on schedule start call back: " + error)
                }
            }
            if (scheduleItem.endTime < currentDate && !scheduleItem.endCallbackFired && scheduleItem.startCallbackFired) { // Only fire end call back if start call back has been called once
                scheduleItem.endCallbackFired = true
                try {
                    scheduleItem.endCallback()
                } catch (error) {
                    console.log("Error on schedule end call back: " + error)
                }
            }
        });

    }
}

export class Schedule {
    startTime: number
    endTime: number
    startCallbackFired: boolean = false
    startCallback: Function
    endCallbackFired: boolean = false
    endCallback: Function

    constructor(_startTime: number, _endTime: number, _startCallback: Function, _endCallback: Function) {
        this.startTime = _startTime
        this.endTime = _endTime
        this.startCallback = _startCallback
        this.endCallback = _endCallback
    }

}