import Wearable from "../utils/interfaces/wearable"

let wearables = {
    helmet: {
        name: "Helmet",
        rarity: "Common",
        id: "Helmet",
        price: 600,
        image_path: "models/wearables/helmet.glb",
        numericalId: 1,
        active: true,
        collection: "0x3045d4e3b5322c866fb03fcdbbf63050433da922",
        stock: 0,
        posy: 0.9
    },
    upperBody: {
        name: "Upper Body",
        rarity: "Common",
        id: "Upper Body",
        price: 400,
        image_path: "models/wearables/jacket.glb",
        numericalId: 2,
        active: true,
        collection: "0x3045d4e3b5322c866fb03fcdbbf63050433da922",
        stock: 0,
        posy: 1
    },
    lowerBody: {
        name: "Lower Body",
        rarity: "Common",
        id: "Lower Body",
        price: 500,
        image_path: "models/wearables/pants.glb",
        numericalId: 3,
        active: true,
        collection: "0x3045d4e3b5322c866fb03fcdbbf63050433da922",
        stock: 0,
        posy: 1.6
    },
    gloves: {
        name: "Gloves",
        rarity: "Common",
        id: "Gloves",
        price: 400,
        image_path: "models/wearables/gloves.glb",
        numericalId: 4,
        active: true,
        collection: "0x3045d4e3b5322c866fb03fcdbbf63050433da922",
        stock: 0,
        posy: 0.9
    },
    boots: {
        name: "Boots",
        rarity: "Common",
        id: "Boots",
        price: 500,
        image_path: "models/wearables/boots.glb",
        numericalId: 5,
        active: true,
        collection: "0x3045d4e3b5322c866fb03fcdbbf63050433da922",
        stock: 0,
        posy: 2
    }
}


export const wearable_boxes = {
    helmet: { position: { x: 98.8, y: 1  , z: -10.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.5 },
    upperBody: { position: { x: 93.9, y: 1, z: -10.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.5 },
    lowerBody: { position: { x: 91.4 , y: 1, z:-10.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 2 },
    gloves: { position: { x: 96.4, y: 1, z: -10.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 2 },
    boots: { position: { x: 88.9, y: 1, z: -10.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: 2.5 }
}

export function setWearableData(
    id: "helmet" | "upperBody" | "lowerBody" | "gloves" | "boots",
    data: Wearable
) {
    wearables[id] = data
}

export function getWearableData(
    id: "helmet" | "upperBody" | "lowerBody" | "gloves" | "boots",
) {
    return wearables[id]
}