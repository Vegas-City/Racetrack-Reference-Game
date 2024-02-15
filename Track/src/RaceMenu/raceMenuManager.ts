import { Transform } from "@dcl/ecs";
import { CarChoice } from "./carChoice";
import { Quaternion, Vector3 } from "@dcl/ecs-math";
import { Entity, GltfContainer, engine } from "@dcl/sdk/ecs";
import { MenuButton } from "./menuButton";
import { Car, CarPerspectives } from "@vegascity/racetrack/src/car";
import { GameManager, Lap, TrackManager } from "@vegascity/racetrack/src/racetrack";
import * as trackConfig1 from "../../data/track_01.json"
import * as trackConfig2 from "../../data/track_02.json"
import * as trackConfig3 from "../../data/track_03.json"
import * as trackConfig4 from "../../data/track_04.json"
import { Minimap } from "@vegascity/racetrack/src/ui";
import { ServerComms } from "../Server/serverComms";

export class RaceMenuManager {
    static instance: RaceMenuManager

    basePodium: Entity
    carPodium: Entity
    carContainer: Entity
    podiumSpinSpeed: number = 10
    podiumRotation: number = 0

    carChoices: CarChoice[] = []
    currentCarIndex: number = 0
    currentTrackIndex: number = 1

    menuTitles: Entity

    practiceButton: MenuButton
    competitionButton: MenuButton

    trackButton1: MenuButton
    trackButton2: MenuButton
    trackButton3: MenuButton

    carButton1: MenuButton
    carButton2: MenuButton
    carButton3: MenuButton

    raceButton: MenuButton

    minimap1: Entity
    minimap2: Entity
    minimap3: Entity
    minimap4: Entity

    constructor(_position: Vector3) {
        RaceMenuManager.instance = this

        this.basePodium = engine.addEntity()
        Transform.create(this.basePodium, {
            position: _position,
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(0.8, 0.8, 0.8)
        })
        GltfContainer.create(this.basePodium, { src: "models/selection/baseBig.glb" })

        this.carPodium = engine.addEntity()
        Transform.create(this.carPodium, {
            parent: this.basePodium
        })
        GltfContainer.create(this.carPodium, { src: "models/selection/baseSmall.glb" })

        this.carContainer = engine.addEntity()
        Transform.create(this.carContainer, {
            parent: this.basePodium
        })

        this.initialiseMinimaps()
        this.initialiseMenu()
        this.initialiseCars()

        engine.addSystem(this.rotate.bind(this))
    }

    private initialiseMinimaps(): void {
        this.minimap1 = engine.addEntity()
        Transform.create(this.minimap1, {
            parent: this.basePodium
        })
        GltfContainer.create(this.minimap1, { src: "models/selection/minimap1.glb" })

        this.minimap2 = engine.addEntity()
        Transform.create(this.minimap2, {
            parent: this.basePodium,
            scale: Vector3.Zero()
        })
        GltfContainer.create(this.minimap2, { src: "models/selection/minimap2.glb" })

        this.minimap3 = engine.addEntity()
        Transform.create(this.minimap3, {
            parent: this.basePodium,
            scale: Vector3.Zero()
        })
        GltfContainer.create(this.minimap3, { src: "models/selection/minimap3.glb" })

        this.minimap4 = engine.addEntity()
        Transform.create(this.minimap4, {
            parent: this.basePodium,
            scale: Vector3.Zero()
        })
        GltfContainer.create(this.minimap4, { src: "models/selection/minimap4.glb" })
    }

    private initialiseMenu(): void {
        this.menuTitles = engine.addEntity()
        Transform.create(this.menuTitles, {
            parent: this.basePodium
        })
        GltfContainer.create(this.menuTitles, { src: "models/selection/menuTitles.glb" })

        this.initialiseGameModeMenu()
        this.initialiseTrackMenu()
        this.initialiseCarMenu()
        this.initialiseRaceMenu()

        this.trackButton2.unlock()
        this.trackButton3.unlock()

        this.carButton2.unlock()
        this.carButton3.unlock()
    }

    private initialiseGameModeMenu(): void {
        this.practiceButton = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(5.05, 2.58, -4.8),
            rotation: Quaternion.fromEulerDegrees(0, 43, 0),
            scale: Vector3.create(0.1, 0.5, 3.8),
            src: "models/selection/practice.glb",
            srcSelected: "models/selection/practice_selected.glb",
            startSelected: true,
            onSelectCallback: (() => {
                this.deselectAllGameModes()
                TrackManager.isPractice = true
                this.trackButton2.hide()
                this.trackButton3.hide()
                this.trackButton1.select()
            }).bind(this)
        })

        this.competitionButton = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(5.05, 1.92, -4.8),
            rotation: Quaternion.fromEulerDegrees(0, 43, 0),
            scale: Vector3.create(0.1, 0.5, 3.8),
            src: "models/selection/competition.glb",
            srcSelected: "models/selection/competition_selected.glb",
            onSelectCallback: (() => {
                this.deselectAllGameModes()
                TrackManager.isPractice = false
                this.trackButton2.show()
                this.trackButton3.show()
            }).bind(this)
        })
    }

    private initialiseTrackMenu(): void {
        this.trackButton1 = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(1.7, 2.58, -6.9),
            rotation: Quaternion.fromEulerDegrees(0, 76, 0),
            scale: Vector3.create(0.1, 0.5, 2.85),
            src: "models/selection/track1.glb",
            srcSelected: "models/selection/track1_selected.glb",
            srcWhiteCup: "models/selection/track1_whitecup.glb",
            srcGoldCup: "models/selection/track1_goldcup.glb",
            startSelected: true,
            onSelectCallback: (() => {
                this.currentTrackIndex = 1
                this.deselectAllTracks()
                Transform.getMutable(this.minimap1).scale = Vector3.One()
                Transform.getMutable(this.minimap2).scale = Vector3.Zero()
                Transform.getMutable(this.minimap3).scale = Vector3.Zero()
                Transform.getMutable(this.minimap4).scale = Vector3.Zero()
            }).bind(this)
        })

        this.trackButton2 = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(1.7, 1.92, -6.9),
            rotation: Quaternion.fromEulerDegrees(0, 76, 0),
            scale: Vector3.create(0.1, 0.5, 2.85),
            src: "models/selection/track2.glb",
            srcSelected: "models/selection/track2_selected.glb",
            srcLock: "models/selection/track2_lock.glb",
            srcWhiteCup: "models/selection/track2_whitecup.glb",
            srcGoldCup: "models/selection/track2_goldcup.glb",
            startLocked: true,
            onSelectCallback: (() => {
                this.currentTrackIndex = 2
                this.deselectAllTracks()
                Transform.getMutable(this.minimap1).scale = Vector3.Zero()
                Transform.getMutable(this.minimap2).scale = Vector3.One()
                Transform.getMutable(this.minimap3).scale = Vector3.Zero()
                Transform.getMutable(this.minimap4).scale = Vector3.Zero()
            }).bind(this)
        })

        this.trackButton3 = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(1.7, 1.26, -6.9),
            rotation: Quaternion.fromEulerDegrees(0, 76, 0),
            scale: Vector3.create(0.1, 0.5, 2.85),
            src: "models/selection/track3.glb",
            srcSelected: "models/selection/track3_selected.glb",
            srcLock: "models/selection/track3_lock.glb",
            srcWhiteCup: "models/selection/track3_whitecup.glb",
            srcGoldCup: "models/selection/track3_goldcup.glb",
            startLocked: true,
            onSelectCallback: (() => {
                this.currentTrackIndex = 3
                this.deselectAllTracks()
                Transform.getMutable(this.minimap1).scale = Vector3.Zero()
                Transform.getMutable(this.minimap2).scale = Vector3.Zero()
                Transform.getMutable(this.minimap3).scale = Vector3.One()
                Transform.getMutable(this.minimap4).scale = Vector3.Zero()
            }).bind(this)
        })
        
        this.trackButton2.hide()
        this.trackButton3.hide()
    }

    private initialiseCarMenu(): void {
        this.carButton1 = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(-3.92, 2.58, -5.9),
            rotation: Quaternion.fromEulerDegrees(0, 123.8, 0),
            scale: Vector3.create(0.1, 0.5, 3.55),
            src: "models/selection/car1b.glb",
            srcSelected: "models/selection/car1b_selected.glb",
            startSelected: true,
            onSelectCallback: (() => {
                this.deselectAllCars()
                this.selectCar(0)
            }).bind(this)
        })

        this.carButton2 = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(-3.92, 1.92, -5.9),
            rotation: Quaternion.fromEulerDegrees(0, 123.8, 0),
            scale: Vector3.create(0.1, 0.5, 3.55),
            src: "models/selection/car2b.glb",
            srcSelected: "models/selection/car2b_selected.glb",
            srcLock: "models/selection/car2b_lock.glb",
            startLocked: true,
            onSelectCallback: (() => {
                this.deselectAllCars()
                this.selectCar(1)
            }).bind(this)
        })

        this.carButton3 = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(-3.92, 1.26, -5.9),
            rotation: Quaternion.fromEulerDegrees(0, 123.8, 0),
            scale: Vector3.create(0.1, 0.5, 3.55),
            src: "models/selection/car3b.glb",
            srcSelected: "models/selection/car3b_selected.glb",
            srcLock: "models/selection/car3b_lock.glb",
            startLocked: true,
            onSelectCallback: (() => {
                this.deselectAllCars()
                this.selectCar(2)
            }).bind(this)
        })
    }

    private initialiseRaceMenu(): void {
        this.raceButton = new MenuButton({
            parent: this.basePodium,
            position: Vector3.create(-6.55, 2.25, -2.7),
            rotation: Quaternion.fromEulerDegrees(0, 157.5, 0),
            scale: Vector3.create(0.1, 1.18, 3.55),
            src: "models/selection/race.glb",
            onSelectCallback: this.startRace.bind(this)
        })
    }

    private initialiseCars(): void {
        this.carChoices.push(new CarChoice(0, "models/selection/car1.glb", {
            parent: this.carContainer,
            position: Vector3.create(0, 0.4, 0),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(0.95, 0.95, 0.95)
        }))

        this.carChoices.push(new CarChoice(1, "models/selection/car2.glb", {
            parent: this.carContainer,
            position: Vector3.create(0, 0.4, 0),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(0.95, 0.95, 0.95)
        }))

        this.carChoices.push(new CarChoice(2, "models/selection/car3.glb", {
            parent: this.carContainer,
            position: Vector3.create(0, 0.4, 0),
            rotation: Quaternion.fromEulerDegrees(0, 180, 0),
            scale: Vector3.create(0.95, 0.95, 0.95)
        }))

        this.carChoices[0].show()
    }

    private deselectAllGameModes(): void {
        this.practiceButton.deselect()
        this.competitionButton.deselect()
    }

    private deselectAllTracks(): void {
        this.trackButton1.deselect()
        this.trackButton2.deselect()
        this.trackButton3.deselect()
    }

    private deselectAllCars(): void {
        this.carButton1.deselect()
        this.carButton2.deselect()
        this.carButton3.deselect()
    }

    private rotate(_dt: number): void {
        this.podiumRotation += _dt * this.podiumSpinSpeed
        if (this.podiumRotation > 360) { this.podiumRotation -= 360 }
        Transform.getMutable(this.carContainer).rotation = Quaternion.fromEulerDegrees(0, this.podiumRotation, 0)
    }

    private selectCar(_index: number): void {
        this.currentCarIndex = _index
        RaceMenuManager.hideAllCars()
        RaceMenuManager.instance.carChoices[this.currentCarIndex].show()
    }

    private startRace(): void {
        RaceMenuManager.LoadTrack(TrackManager.isPractice ? 0 : this.currentTrackIndex)
        RaceMenuManager.instance.carChoices[this.currentCarIndex].LoadCar()
        CarPerspectives.enterCar(Car.instances[0].data)
        this.raceButton.deselect()
    }

    static LoadTrack(_trackNumber: number) {
        GameManager.reset()
        switch (_trackNumber) {
            case 0: TrackManager.trackID = 1
                TrackManager.isPractice = true
                TrackManager.Load(trackConfig1)
                ServerComms.setTrack("6a0a3950-bcfb-4eb4-9166-61edc233b82b")
                Lap.totalLaps = 1
                break
            case 1: TrackManager.trackID = 1
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig1)
                ServerComms.setTrack("6a0a3950-bcfb-4eb4-9166-61edc233b82b")
                Lap.totalLaps = 2
                break
            case 2: TrackManager.trackID = 2
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig2)
                ServerComms.setTrack("17e75c78-7f17-4b7f-8a13-9d1832ec1231")
                Lap.totalLaps = 2
                break
            case 3: TrackManager.trackID = 3
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig3)
                ServerComms.setTrack("ec2a8c30-678a-4d07-b56e-7505ce8f941a")
                Lap.totalLaps = 2
                break
            case 4: TrackManager.trackID = 4
                TrackManager.isPractice = false
                TrackManager.Load(trackConfig4)
                ServerComms.setTrack("a8ceec44-5a8f-4c31-b026-274c865ca689")
                Lap.totalLaps = 2
                break
        }
        Minimap.Load(
            {
                srcWidth: 992,
                srcHeight: 815,
                parcelWidth: 11,
                parcelHeight: 9,
                bottomLeftX: -32,
                bottomLeftZ: 16,
                offsetX: 0.75,
                offsetZ: 0.75,
                paddingBottom: 51,
                paddingTop: 45,
                paddingLeft: 60,
                paddingRight: 50,
                scale: 0.3
            }
        )
    }

    static hideAllCars(): void {
        RaceMenuManager.instance.carChoices.forEach(car => {
            car.hide()
        });
    }
}