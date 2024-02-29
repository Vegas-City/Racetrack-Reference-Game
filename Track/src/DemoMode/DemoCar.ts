import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { GhostPoint } from "@vegascity/racetrack/src/ghostCar";
import * as ghostData from "./DemoData.json"

export class DemoCar {
    parent:Entity
    entity:Entity
    hidden:boolean = true

    points: GhostPoint[] = [] 

    pointIndex: number = 0
    currentUpdateTime: number = 0
    targetPoint: GhostPoint = {checkPoint:0,position:Vector3.create(0,0,0),rotation:Quaternion.fromEulerDegrees(0,0,0)}
    lastPoint: GhostPoint= {checkPoint:0,position:Vector3.create(0,0,0),rotation:Quaternion.fromEulerDegrees(0,0,0)}
    currentLerp: number = 0
    
    constructor(_startpoint:number, _modelPath:string){
        this.pointIndex = _startpoint
        this.currentUpdateTime = _startpoint *0.075

        this.parent = engine.addEntity()
        this.entity = engine.addEntity()
        Transform.createOrReplace(this.parent, {position:Vector3.create(0,-0.8,0)})
        Transform.createOrReplace(this.entity, {parent:this.parent})

        GltfContainer.createOrReplace(this.entity,{src:_modelPath})
        
        //Load data
        ghostData.points.forEach(point => {
            this.points.push({
                checkPoint:point.cp,
                position: point.p,
                rotation: point.r
            })
        }); 
    }

    hide(){
        let transform = Transform.getMutableOrNull(this.entity)
        if(transform!=null){
            transform.scale = Vector3.Zero()
            this.hidden = true
        }
    }

    show(){
        let transform = Transform.getMutableOrNull(this.entity)
        if(transform!=null){
            transform.scale = Vector3.One()
            this.hidden = false
        }
    }

    update(_dt:number){
        if(this.hidden){
            return
        }

        let transform = Transform.getMutableOrNull(this.entity)
        if (!transform){
            return
        } 

        this.currentUpdateTime += _dt
        this.currentLerp += _dt

        // Plot the course //
        let newIndex: number = Math.floor((this.currentUpdateTime / 0.075))

        if (newIndex >= this.points.length) {
            // We've reached the end
            this.currentUpdateTime = 0
            newIndex = 0
            this.pointIndex = newIndex
            this.lastPoint = this.targetPoint
            this.targetPoint = this.points[this.pointIndex]
            this.currentLerp = 0
        } else if (newIndex > this.pointIndex) {
            // Move target to the next point
            this.pointIndex = newIndex
            this.lastPoint = this.targetPoint
            this.targetPoint = this.points[this.pointIndex]
            this.currentLerp = 0
        }
            
        // Drive the course //
        transform.position = Vector3.lerp(this.lastPoint.position, this.targetPoint.position, this.currentLerp / 0.075)
        transform.rotation = this.targetPoint.rotation
    }
}