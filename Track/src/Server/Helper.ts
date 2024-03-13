/* import */

import { UserData as DCLUserData, getUserData } from "~system/UserIdentity"
import { GetCurrentRealmResponse, getCurrentRealm } from "~system/EnvironmentApi"
import { EnvironmentType } from "./EnvironmentType"

import { onEnterSceneObservable, onLeaveSceneObservable } from '@dcl/sdk/observables'
import { ObserverEventState } from "@dcl/sdk/internal/Observable"
import { executeTask } from "@dcl/ecs"

/* class definition */

export abstract class Helper {

    /* constants */

    private static readonly LOGGING_PREFIX = "vegascity.core.Helper"

    /* fields */

    //private static __camera: Camera = Camera.instance

    private static __isRealmInitialised: boolean = false
    private static __isInitialised: boolean = false
    private static __realm: string

    private static __onInit: { (): void } | null;

    public static isInScene: boolean
    private static __onEnterSceneHandlers: (() => void)[] = []
    private static __onLeaveSceneHandlers: (() => void)[] = []
    static __camera: any

    private static onInitFired: boolean = false

    /* private methods */

    private static __checkInitialised(): void {

        // set overall initialisation state based on combined partial initialisation states
        Helper.__isInitialised = Helper.__isRealmInitialised
        if (Helper.__isInitialised) {

            // fire and clear the callback
            if (Helper.__onInit !== undefined && Helper.__onInit !== null) {
                if (!Helper.onInitFired) {
                    Helper.onInitFired = true
                    Helper.__onInit()
                    Helper.__onInit = null
                }
            }
        }
    }

    private static __enforceInitialised(): void {
        if (!Helper.__isInitialised) {
            throw "Attempted to use vegascity.core.Helper before it was initialised"
        }
    }

    private static __init(): void {

        // don't reinitialise
        if (Helper.__isInitialised) {

            // fire and clear the callback
            if (Helper.__onInit !== undefined && Helper.__onInit !== null) {
                if (!Helper.onInitFired) {
                    Helper.onInitFired = true
                    Helper.__onInit()
                    Helper.__onInit = null
                }
            }
            return
        }

        // fire off a check for the realm
        getCurrentRealm({})
            .then((_realm: GetCurrentRealmResponse) => {
                Helper.__realm = _realm.currentRealm?.domain ? _realm.currentRealm?.domain : "localhost"
                Helper.__isRealmInitialised = true
                Helper.__checkInitialised()
            })
            .catch(() => {
                this.__logError("Unable to retrieve the current realm")
                Helper.__isRealmInitialised = true;
                Helper.__checkInitialised()
            })

        onEnterSceneObservable.add(
            (_eventData: { userId: string }, _eventState: ObserverEventState): void => {
                UserData.getUserData(() => {
                    if (_eventData.userId.toLowerCase() !== UserData.cachedData?.userId.toLowerCase()) {
                        return
                    } else {
                        Helper.isInScene = true
                        for (let h of Helper.__onEnterSceneHandlers) {
                            h()
                        }
                    }
                })
            }
        )
        onLeaveSceneObservable.add(
            (_eventData: { userId: string }, _eventState: ObserverEventState): void => {
                if (UserData.cachedData === undefined || UserData.cachedData === null) {
                    return
                }
                if (_eventData.userId.toLowerCase() !== UserData.cachedData.userId.toLowerCase()) {
                    return
                }
                Helper.isInScene = false
                for (let h of Helper.__onLeaveSceneHandlers) {
                    h()
                }
            }
        )
    }

    private static __logError(_message: string): void {
        Error(Helper.LOGGING_PREFIX + _message)
    }

    public static getEnvironmentType(): EnvironmentType {
        Helper.__enforceInitialised()
        let lowerServerName = this.__realm.toLocaleLowerCase()
        let lowerDomain = this.__realm.toLocaleLowerCase()
        if (this.__realm === undefined || this.__realm === null) {
            return EnvironmentType.Localhost
        }

        if (lowerServerName.indexOf("local") != -1 || lowerServerName.indexOf("127.0.0.1") != -1 || this.__realm.toLowerCase() === "localpreview") {
            return EnvironmentType.Localhost
        }

        if (lowerServerName.indexOf("test") != -1 || lowerDomain.indexOf("test") != -1) {
            return EnvironmentType.Test
        }

        switch (this.__realm.toLowerCase()) {
            case "localhost":
                return EnvironmentType.Localhost
            case "testing":
                return EnvironmentType.Test
            default:
                return EnvironmentType.Live
        }
    }

    public static getRealm(): string {
        Helper.__enforceInitialised()
        return this.__realm
    }

    public static init(_callback: () => void): void {

        // store the callback
        this.__onInit = _callback

        // run initialisation
        this.__init()
    }

    public static isLocalHost(): boolean {
        Helper.__enforceInitialised()
        return this.__realm !== undefined && this.__realm !== null && (this.__realm.toLowerCase() === "localhost" || this.__realm.indexOf("127.0.0.1") > -1 || this.__realm.toLowerCase() === "localpreview")
    }

}

/* user data (moved here to avoid cyclic dependency issues) */

export abstract class UserData {

    /* static fields */

    static cachedData: DCLUserData | null
    private static __isWhitelisted: boolean | null
    static UserData: import("~system/UserIdentity").GetUserDataResponse

    /* static methods */

    static checkWhitelisting(_allowedAddresses: string[], _onAllow: () => void, _onBlock?: () => void) {

        // if localhost, don't apply
        if (Helper.isLocalHost()) {
            UserData.__isWhitelisted = true
            if (_onAllow !== undefined && _onAllow !== null) {
                _onAllow()
            }
            return
        }

        // ensure user data and an allow list
        if (UserData.cachedData === undefined || UserData.cachedData === null || _allowedAddresses === undefined || _allowedAddresses === null || _allowedAddresses.length === 0) {
            UserData.__isWhitelisted = false
            if (_onBlock !== undefined && _onBlock !== null) {
                _onBlock()
            }
            return
        }

        // Is it a guest?
        if (UserData.cachedData.publicKey == null) {
            if (_onBlock !== undefined && _onBlock !== null) {
                _onBlock()
            }
            return
        }

        // iterate allowed addresses
        for (let a of _allowedAddresses) {

            // check for a match
            if (a.toLowerCase() === UserData.cachedData.publicKey.toLowerCase()) {
                UserData.__isWhitelisted = true
                if (_onAllow !== undefined && _onAllow !== null) {
                    _onAllow()
                }
                return
            }
        }

        // doesn't match any allowed address
        UserData.__isWhitelisted = false
        if (_onBlock !== undefined && _onBlock !== null) {
            _onBlock()
        }
    }

    static getUserData(_callback: (_userData: DCLUserData) => void): void {
        if (UserData.cachedData !== undefined && UserData.cachedData !== null) {
            if (_callback !== undefined && _callback !== null) {
                _callback(UserData.cachedData);
            }
            return;
        }

        executeTask(async () => {
            let response = await getUserData({})
            UserData.cachedData = response.data as DCLUserData; // Type assertion to DCLUserData
            if (UserData.cachedData.publicKey === undefined || UserData.cachedData.publicKey === null) {
                if (Helper.isLocalHost()) {
                    UserData.cachedData.publicKey = "LOCAL_TEST_KEY_" + (Math.random() * 1000).toFixed(0);
                }
            }
            if (_callback !== undefined && _callback !== null) {
                _callback(UserData.cachedData);
            }
        });
    }


    static isWhitelisted(): boolean {
        if (UserData.__isWhitelisted === null) {
            throw new Error("Attempt to check isWhitelisted before UserData loaded or whitelist provided via checkWhitelisting.")
        }
        return UserData.__isWhitelisted
    }
}