import Wearable from "../utils/interfaces/wearable"

let wearables = {
    helmet: {
        name: "Helmet",
        rarity: "Common",
        id: "Helmet",
        price: 300,
        image_path: "",
        numericalId: 1,
        active: true,
        collection: "store",
        stock: 0
    },
    upperBody: {
        name: "Upper Body",
        rarity: "Common",
        id: "Upper Body",
        price: 200,
        image_path: "",
        numericalId: 2,
        active: true,
        collection: "store",
        stock: 0
    },
    lowerBody: {
        name: "Lower Body",
        rarity: "Common",
        id: "Lower Body",
        price: 250,
        image_path: "",
        numericalId: 3,
        active: true,
        collection: "store",
        stock: 0
    },
    gloves: {
        name: "Gloves",
        rarity: "Common",
        id: "Gloves",
        price: 200,
        image_path: "",
        numericalId: 4,
        active: true,
        collection: "store",
        stock: 0
    },
    boots: {
        name: "Boots",
        rarity: "Common",
        id: "Boots",
        price: 250,
        image_path: "",
        numericalId: 5,
        active: true,
        collection: "store",
        stock: 0
    }
}

export const wearable_models = {
    helmet: "models/shop_colliders/left_wearables_white_collider.glb",
    upperBody: "models/shop_colliders/right_wearables_white_collider.glb",
    lowerBody: "models/shop_colliders/left_wearables_orange_collider.glb",
    gloves: "models/shop_colliders/right_wearables_orange_collider.glb",
    boots: "models/shop_colliders/left_wearables_green_collider.glb",
}

export const wearable_boxes = {
    helmet: { position: { x: 90, y: 1, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.5 },
    upperBody: { position: { x: 90, y: 1, z: -9 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1.5 },
    lowerBody: { position: { x: 85, y: 1, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: 2 },
    gloves: { position: { x: 80, y: 1, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: 2 },
    boots: { position: { x: 80, y: 1, z: -9 }, rotation: { x: 0, y: 0, z: 0 }, scale: 2.5 }
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