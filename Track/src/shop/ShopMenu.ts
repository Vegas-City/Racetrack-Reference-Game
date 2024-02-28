import { Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from "@dcl/ecs"
import { Quaternion, Vector3 } from "@dcl/ecs-math"
import { shopUI } from "../utils/ui-provider"
import Wearable from "../utils/interfaces/wearable"
import { getWearableData } from "./wearables"
import { ServerComms } from "../Server/serverComms"

export class ShopMenu {

    static items: ShopButton[]
    constructor(){
        ShopMenu.items = [new ShopButton(Vector3.create(98.9,2.42,-9),"models/wearables/helmet_btn.glb",getWearableData("helmet")),
        new ShopButton(Vector3.create(98.9-2.42,2.4,-9),"models/wearables/gloves_btn.glb",getWearableData("gloves")),
        new ShopButton(Vector3.create(98.9-2.42*2,2.4,-9),"models/wearables/jacket_btn.glb",getWearableData("upperBody")),
        new ShopButton(Vector3.create(98.9-2.42*3,2.4,-9),"models/wearables/pants_btn.glb",getWearableData("lowerBody")),
        new ShopButton(Vector3.create(98.9-2.42*4,2.4,-9),"models/wearables/boots_btn.glb",getWearableData("boots"))]
    }
}

export class ShopButton {
    nameEntity:Entity
    buyEntity:Entity
    lockEntity:Entity
    locked:boolean = true
    data:Wearable

    constructor(_position:Vector3,_modelPath:string, data: Wearable){
        this.nameEntity = engine.addEntity()
        this.buyEntity = engine.addEntity()
        this.lockEntity = engine.addEntity()
        this.data = data

        Transform.create(this.buyEntity, {position:_position, rotation: Quaternion.fromEulerDegrees(0,180,0)})
        Transform.create(this.nameEntity, {position:Vector3.create(0,0.25,0), parent:this.buyEntity})
        Transform.create(this.lockEntity, {position:Vector3.create(0,0,-0.03), parent:this.buyEntity})
        GltfContainer.create(this.nameEntity, {src: _modelPath})
        GltfContainer.create(this.buyEntity, {src: "models/wearables/buy_btn.glb"})
        GltfContainer.create(this.lockEntity, {src: "models/wearables/lock.glb"})
        
        let self = this
        pointerEventsSystem.onPointerDown({
            entity: self.buyEntity,
            opts: { button: InputAction.IA_POINTER, hoverText: `BUY: ` + data.id, maxDistance: 10 }
        }, () => {
            if(!self.locked){
                shopUI.show(data)
            }
        })
    }

    lock(){
        this.locked = true
        Transform.getMutable(this.lockEntity).scale = Vector3.One()
    }

    unlock(points: number){
        if(points >= this.data.price){
            this.locked = false
            Transform.getMutable(this.lockEntity).scale = Vector3.Zero()
        } else {
            this.lock()
        }
    }
}