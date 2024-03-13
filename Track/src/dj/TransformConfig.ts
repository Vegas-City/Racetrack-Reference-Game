import { Entity } from "@dcl/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

export type TransformConfig = {
    parent?: Entity
    position?: Vector3
    rotation?: Quaternion
    scale?: Vector3
}