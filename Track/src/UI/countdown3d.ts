import { Entity, Material, MaterialTransparencyMode, MeshRenderer, PBMaterial_PbrMaterial, Transform, engine } from "@dcl/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/ecs-math"

export class Countdown3d {
    static readonly SPACING: number = 0.65
    static instances: Countdown3d[] = []

    startDate: Date
    duration: number

    scale: Vector3

    container: Entity
    minDigit1: Entity
    minDigit2: Entity
    colon: Entity
    secDigit1: Entity
    secDigit2: Entity

    constructor(_startDate: Date, _duration: number, _position: Vector3, _rotation: Quaternion, _scale: Vector3) {
        this.startDate = _startDate
        this.duration = _duration
        this.scale = Vector3.clone(_scale)

        this.container = engine.addEntity()
        Transform.createOrReplace(this.container, {
            position: _position,
            rotation: Quaternion.multiply(_rotation, Quaternion.fromEulerDegrees(0, 0, -90)),
            scale: _scale
        })

        this.minDigit1 = engine.addEntity()
        Transform.createOrReplace(this.minDigit1, {
            parent: this.container,
            position: Vector3.create(0, 2 * Countdown3d.SPACING, 0)
        })
        Material.setPbrMaterial(this.minDigit1, this.getMaterial())

        this.minDigit2 = engine.addEntity()
        Transform.createOrReplace(this.minDigit2, {
            parent: this.container,
            position: Vector3.create(0, Countdown3d.SPACING, 0)
        })
        Material.setPbrMaterial(this.minDigit2, this.getMaterial())

        this.colon = engine.addEntity()
        Transform.createOrReplace(this.colon, {
            parent: this.container,
            position: Vector3.create(0, 0, 0)
        })
        MeshRenderer.setPlane(this.colon, this.getCharacterUVs(":"))
        Material.setPbrMaterial(this.colon, this.getMaterial())

        this.secDigit1 = engine.addEntity()
        Transform.createOrReplace(this.secDigit1, {
            parent: this.container,
            position: Vector3.create(0, -Countdown3d.SPACING, 0)
        })
        Material.setPbrMaterial(this.secDigit1, this.getMaterial())

        this.secDigit2 = engine.addEntity()
        Transform.createOrReplace(this.secDigit2, {
            parent: this.container,
            position: Vector3.create(0, -2 * Countdown3d.SPACING, 0)
        })
        Material.setPbrMaterial(this.secDigit2, this.getMaterial())

        if (Countdown3d.instances.length < 1) {
            engine.addSystem(Countdown3d.Update)
        }

        Countdown3d.instances.push(this)
    }

    static Update(): void {
        Countdown3d.instances.forEach(instance => {
            instance.update()
        })
    }

    private update(): void {
        const now = new Date()
        const endDate = new Date(this.startDate.getTime() + ((this.duration + 1) * 1000))
        if (now < this.startDate || now > endDate) {
            this.hide()
            return
        }

        this.show()

        const elapsed = Math.floor((now.getTime() - this.startDate.getTime()) / 1000)
        const rem = this.duration - elapsed
        const minutes = Math.floor(rem / 60)
        const seconds = rem % 60

        let minutesStr = minutes.toString()
        if (minutesStr.length < 2) {
            minutesStr = "0" + minutesStr
        }

        let secondsStr = seconds.toString()
        if (secondsStr.length < 2) {
            secondsStr = "0" + secondsStr
        }

        MeshRenderer.setPlane(this.minDigit1, this.getCharacterUVs(minutesStr[0]))
        MeshRenderer.setPlane(this.minDigit2, this.getCharacterUVs(minutesStr[1]))
        MeshRenderer.setPlane(this.secDigit1, this.getCharacterUVs(secondsStr[0]))
        MeshRenderer.setPlane(this.secDigit2, this.getCharacterUVs(secondsStr[1]))
    }

    private getCharacterUVs(_character: string) {
        switch (_character) {
            case "0": return this.getUVs(0, 0.2, 0, 0.33)
            case "1": return this.getUVs(0.2, 0.4, 0, 0.33)
            case "2": return this.getUVs(0.4, 0.6, 0, 0.33)
            case "3": return this.getUVs(0.6, 0.8, 0, 0.33)
            case "4": return this.getUVs(0.8, 1, 0, 0.33)
            case "5": return this.getUVs(0, 0.2, 0.33, 0.67)
            case "6": return this.getUVs(0.2, 0.4, 0.33, 0.67)
            case "7": return this.getUVs(0.4, 0.6, 0.33, 0.67)
            case "8": return this.getUVs(0.6, 0.8, 0.33, 0.67)
            case "9": return this.getUVs(0.8, 1, 0.33, 0.67)
            case ":": return this.getUVs(0.16, 0.28, 0.64, 1)
        }
        return this.getUVs(0, 1, 0, 1)
    }

    private getUVs(_minX: number, _maxX: number, _minY: number, _maxY: number) {
        const minX = _minX
        const maxX = _maxX
        const minY = 1 - _maxY
        const maxY = 1 - _minY
        return [
            minX, minY,
            maxX, minY,
            maxX, maxY,
            minX, maxY,
            maxX, minY,
            minX, minY,
            minX, maxY,
            maxX, maxY,
        ]
    }

    private getMaterial(): PBMaterial_PbrMaterial {
        return {
            texture: Material.Texture.Common({
                src: "images/ui/numbersSpriteSheet.png",
            }),
            transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
            emissiveColor: Color4.White(),
            emissiveIntensity: 1
        }
    }

    private show(): void {
        let transform = Transform.getMutableOrNull(this.container)
        if (transform) {
            transform.scale = this.scale
        }
    }

    private hide(): void {
        let transform = Transform.getMutableOrNull(this.container)
        if (transform) {
            transform.scale = Vector3.Zero()
        }
    }
}