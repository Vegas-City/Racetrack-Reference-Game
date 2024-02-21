import { Entity, GltfContainer, InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs"
import { popup, shopUI, wallet } from "../utils/ui-provider"
import { getWearableData,wearable_boxes } from "./wearables"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import Wearable from "../utils/interfaces/wearable"
import { signedFetch } from "~system/SignedFetch"
import { ServerComms } from "../Server/serverComms"
import { Logger } from "@vegascity/vegas-city-logger"
import * as utils from '@dcl-sdk/utils'

export class ShopController {
    static logger: Logger = new Logger("AI_FAIR_SOPHIAVERSE", engine, Transform)

    private clickInfo = {
        lastClickTimestamp: 0,
        lastDoubleClickEmitTimestamp: 0,
    }

    private userKey: string = "zero"

    constructor() {

    }

    public setupClickables() {
        for (const wearable in wearable_boxes) {
            
            if (wearable == "helmet" ||
                wearable == "upperBody" ||
                wearable == "lowerBody" ||
                wearable == "gloves" ||
                wearable == "boots"
            ) { this.addClickable(wearable_boxes[wearable as keyof typeof wearable_boxes], getWearableData(wearable)) }
        }
    }

    private addClickable(model: { position: Vector3, rotation: Vector3, scale: number }, data: Wearable) {
        const plinth = engine.addEntity()
        Transform.create(plinth, {
            scale: Vector3.create(1,1,1),
            position: model.position,
            rotation: Quaternion.fromEulerDegrees(model.rotation.x, model.rotation.y, model.rotation.z)
        })

        const collider = engine.addEntity()
        Transform.create(collider, {
            parent: plinth,
            position: Vector3.create(0, 1, 0),
            scale: Vector3.create(2,3.5,2)
        })

        MeshCollider.setCylinder(collider)
        
        const linkEntity = engine.addEntity()
        Transform.create(linkEntity, {
            parent: plinth,
            position: Vector3.create(0,data.posy,0)
        })
        GltfContainer.create(linkEntity, {
            src: data.image_path
        })

        // make collectables spin to draw attention
        utils.perpetualMotions.startRotation(linkEntity, Quaternion.fromEulerDegrees(0, 45, 0))   

        pointerEventsSystem.onPointerDown({
            entity: collider,
            opts: { button: InputAction.IA_POINTER, hoverText: `BUY: ` + data.id, maxDistance: 10 }
        }, () => {
            shopUI.show(data)
        })
    }

    public async sendBuyRequest(id: string, price: number) {
        shopUI.hide()
        let priceS: string = price ? price.toString() : "0" 
        if (this.userKey == "zero") {
            console.log('shop is closed, player dont have a wallet')
            popup.show("Connect with your wallet to enjoy the full experience.")
            return
        }
        let collectionId: string = "0xc2601327f0ed843a0a43e0ee9e189069d3e542e2";
        wallet.addValue(-price)
        let body = {
            collection_id: collectionId,
            wearable_id: id
        }
        const response = await signedFetch({
            url: ServerComms.getServerUrl() + "/api/missions/spend", 
            init: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }})
        const data = response.body;
        console.log('send buy request data:', data);
        if (data !== "submitted") {
            
            popup.show("Oops! It appears we have encountered an error.  Please try again later.")
            ShopController.logger.purchaseFail(id, collectionId, "", priceS, data)
        }
        else {
            popup.show("Your Purchase has been Made and we are sending the wearable to your wallet. This may take a short while. Further attempts to purchase this item will result in you receiving this item multiple times. ")
            ShopController.logger.purchaseSuccess(id, collectionId, "", priceS, data)
            ServerComms.getPlayerData()
        }
    }

    public async updateCollection(key: string) {
        this.userKey = key
        if (key == "zero") {
            console.log('shop is closed, player dont have a wallet')
            return
        }

   
    }
}