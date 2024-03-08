import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export class PodiumNPCs {
    gold: PodiumNPC
    silver: PodiumNPC
    bronze: PodiumNPC

    constructor(){
        this.gold = new PodiumNPC("models/npcs/M_skin_gold.glb",Vector3.create(70.89+0.2,3.23-0.88,93.77),Quaternion.fromEulerDegrees(0,-70,0))
        this.silver = new PodiumNPC("models/npcs/F_skin_silver.glb",Vector3.create(71.8,2.98-0.88,95.8),Quaternion.fromEulerDegrees(0,-50,0))
        this.bronze = new PodiumNPC("models/npcs/M_skin_bronze.glb",Vector3.create(70.6,2.73-0.88,91.6),Quaternion.fromEulerDegrees(0,-90,0))
    } 

    remove(){ 
        engine.removeEntity(this.gold.entity)
        engine.removeEntity(this.silver.entity)
        engine.removeEntity(this.bronze.entity)
    }
}

export class PodiumNPC {
    entity:Entity
    constructor(_modelPath:string, _position:Vector3, _rotation:Quaternion){
        this.entity = engine.addEntity()

        GltfContainer.create(this.entity, {src:_modelPath})
        Transform.create(this.entity, {position: _position, rotation: _rotation})
    }
}       