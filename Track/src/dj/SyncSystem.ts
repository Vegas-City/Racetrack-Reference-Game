/* system definition */

import { InputAction, PointerEventType, inputSystem } from "@dcl/sdk/ecs"

export class SyncSystem {

    /* static fields */

    private static instance: SyncSystem

    /* fields */

    // state
    private bpm: number
    private bpmNoteFraction: number
    private beatUnit: number
    private beatsPerBar: number
    private startTime: number
    private lastBeat: number
    private bpmTapTimes: number[] = []
    private isBPMTapHeld: boolean = false

    // events
    private onBeatListeners: ((_isPrimary: boolean, _beat: number) => void)[]
    private onTapBPMListeners: ((_bpm: number) => void)[]

    /* constructor */

    constructor() {

        // set initial default state
        this.startTime = new Date().getTime()
        this.bpm = 120
        this.bpmNoteFraction = 4
        this.beatUnit = 4
        this.beatsPerBar = 4

        // initialise listeners
        this.onBeatListeners = []
        this.onTapBPMListeners = []
    }

    /* static methods */

    static getInstance(): SyncSystem {
        if (SyncSystem.instance === undefined || SyncSystem.instance === null) {
            SyncSystem.instance = new SyncSystem()
        }
        return SyncSystem.instance
    }

    /* methods */

    getBeatsPerBar(): number {
        return this.beatsPerBar
    }

    getBeatUnit(): number {
        return this.beatUnit
    }

    getBPM(): number {
        return this.bpm
    }

    getBPMNoteFraction(): number {
        return this.bpmNoteFraction
    }

    getMSPerBeat(): number {
        return 60000 / this.bpm * this.bpmNoteFraction / this.beatUnit
    }

    onBeat(_listener: (_isPrimary: boolean, _beat: number) => void): SyncSystem {
        if (this.onBeatListeners.indexOf(_listener) === -1) {
            this.onBeatListeners.push(_listener)
        }
        return this
    }

    onTapBPM(_listener: (_bpm: number) => void): SyncSystem {
        if (this.onTapBPMListeners.indexOf(_listener) === -1) {
            this.onTapBPMListeners.push(_listener)
        }
        return this
    }

    setBPM(_bpm: number, _bpmNoteFraction: number = 4): SyncSystem {
        this.bpm = _bpm
        this.bpmNoteFraction = _bpmNoteFraction
        this.lastBeat = -1
        this.startTime = new Date().getTime()

        return this
    }

    setLastBeat(_timestamp: number, _beatNumber: number): SyncSystem {
        this.startTime = _timestamp
        this.lastBeat = _beatNumber === undefined || _beatNumber === null ? this.beatsPerBar : _beatNumber
        return this
    }

    setTimeSignature(_beatsPerBar: number, _beatUnit: number): SyncSystem {
        this.beatsPerBar = _beatsPerBar
        this.beatUnit = _beatUnit
        this.lastBeat = -1
        this.startTime = new Date().getTime()
        return this
    }

    tap(): SyncSystem {

        // handle tapping to set bpm
        this.bpmTapTimes.push(new Date().getTime())
        if (this.bpmTapTimes.length > 1 && this.bpmTapTimes[this.bpmTapTimes.length - 1] - this.bpmTapTimes[this.bpmTapTimes.length - 2] >= 3000) {
            this.bpmTapTimes = [new Date().getTime()]
            console.log("too long - reset bpm tap")
        }
        if (this.bpmTapTimes.length >= this.beatsPerBar) {
            let averageTapTime = 0
            for (let i = 0; i < this.bpmTapTimes.length - 1; i++) {
                averageTapTime += this.bpmTapTimes[i + 1] - this.bpmTapTimes[i]
            }
            averageTapTime /= (this.bpmTapTimes.length - 1)
            this.bpmTapTimes = []
            this.bpm = Math.round(60 / (averageTapTime / 1000))
            this.lastBeat = -1
            const msPerBeat = 60000 / this.bpm * this.bpmNoteFraction / this.beatUnit
            this.startTime = new Date().getTime() + msPerBeat// - _deltaTime
            console.log("new bpm is " + this.bpm)
            for (let l of this.onTapBPMListeners) {
                if (l !== undefined && l !== null) {
                    l(this.bpm)
                }
            }
        }

        // return self for chaining
        return this
    }

    /* implementation of isystem */

    update(_deltaTime: number): void {

        if (_deltaTime <= 0) {
            return
        }
        _deltaTime = Math.min(_deltaTime, 1 / 15)

        // get the total time elapsed
        const newTime = new Date()
        const elapsedTime = newTime.getTime() - this.startTime

        // get the beat interval
        let msPerBeat = this.getMSPerBeat()

        // check for a beat
        const thisBeat = Math.floor(elapsedTime / msPerBeat)
        if (thisBeat != this.lastBeat) {

            // work out which beat of the bar it is
            const beatOfBar = thisBeat % this.beatsPerBar
            this.lastBeat = thisBeat

            // fire any listeners
            for (let l of this.onBeatListeners) {
                l(beatOfBar === 0, beatOfBar)
            }
        }

        // check for tapping to set bpm
        if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)) {
            if (!this.isBPMTapHeld) {
                this.isBPMTapHeld = true
                this.tap()
            }
        }
        else {
            this.isBPMTapHeld = false
        }
    }
}