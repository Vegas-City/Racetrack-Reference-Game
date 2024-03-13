import { Color3 } from "@dcl/ecs-math"

export type MaterialConfig = {
    emissiveColor?: Color3
    emissiveIntensity?: number
    roughness?: number
    metallic?: number
    castShadows?: boolean
    transparencyMode?: number
    texture?: string
    alphaTexture?: string
    emissiveTexture?: string
    wrapMode?: number
    filterMode?: number
}