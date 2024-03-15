import { showData } from "./scheduleSetup"
import { Material, PBMaterial_PbrMaterial, PBVideoPlayer, VideoPlayer, VideoState } from '@dcl/sdk/ecs'
import { VideoScreens } from './videoScreens'
import { Color3, Color4 } from '@dcl/sdk/math'
import * as showMgmt from 'show-manager/src'

export const SHOW_MGR = new showMgmt.ShowManager()

export function setupShow() {
    //creating a logger for this file
    const logger: showMgmt.Logger = showMgmt.LoggerFactory.getLogger("MyScene.ShowSetup.ts")
    //set logger for a specific logger
    try {
        logger.setLevel(showMgmt.LogLevel.DEBUG)
    } catch (error) {
        console.log("Logger error: " + error)
    }


    //will set default logging level for all loggers
    showMgmt.LoggingConfiguration.getInstance().defaultLevel = showMgmt.LogLevel.DEBUG

    //set logger for a specific action handler logger
    const logHandlerAnimation = showMgmt.LoggerFactory.getLogger("ShowActionHandler." + showMgmt.ShowAnimationActionHandler.DEFAULT_NAME)
    if (logHandlerAnimation) logHandlerAnimation.setLevel(showMgmt.LogLevel.TRACE)

    SHOW_MGR.showSchedule.setData(showData)

    function resetStage() {
        try {
            logger.debug("SHOW_MGR.resetStage", "ENTRY")
        } catch (error) {
            console.log("Logger error: " + error)
        }

        for (const p of ["model-whiterabbit-1", "model-whiterabbit-2"]) {
            const model = SHOW_MGR.actionMgr.getShowEntityByName(p)
            if (model) {
                model.reset()
                model.hide()
            }
        }
    }

    let currentVideoPlayer: PBVideoPlayer
    SHOW_MGR.addStopShowListeners((event: showMgmt.StopShowEvent) => {
        try {
            logger.debug("SHOW_MGR.addStopShowListeners", " fired", event)
        } catch (error) {
            console.log("Logger error: " + error)
        }

        if (currentVideoPlayer) {
            let currentVideoTexuture = currentVideoPlayer
            currentVideoTexuture.playing = false
        }
    })

    SHOW_MGR.addPlayVideoListeners((event: showMgmt.PlayShowEvent) => {

        try {
            logger.debug("SHOW_MGR.addPlayVideoListeners", " fired", event)
        } catch (error) {
            console.log("Logger error: " + error)
        }
        resetStage()

        if (event.showData.id == -1) {
            //   debugger 
            const showRange = SHOW_MGR.showSchedule.findShowToPlayByDate(new Date())
            try {
                logger.info("SHOW_MGR.addPlayVideoListeners", "START COUNTDOWN TO NEXT SHOW", event)
            } catch (error) {
                console.log("Logger error: " + error)
            }


            const showArr: showMgmt.ShowType[] = []
            if (showRange.nextShow && showRange.nextShow.show) {
                showArr.push(showRange.nextShow.show)
            }
        }

        // main video
        if (event.videoPlayerEntity) {
            const videoTexture = Material.Texture.Video({ videoPlayerEntity: event.videoPlayerEntity })

            let videoMat: PBMaterial_PbrMaterial = {
                castShadows: false,
                metallic: 0,
                roughness: 1,
                emissiveIntensity: 1,
                emissiveColor: Color3.White(),
                alphaTest: 1,
                texture: videoTexture,
                emissiveTexture: videoTexture
            }

            let hide: boolean = false

            let vidPlayer = VideoPlayer.getMutableOrNull(event.videoPlayerEntity)
            if (vidPlayer) {
                if (vidPlayer.src.length < 1) {
                    videoMat = {
                        castShadows: false,
                        metallic: 0,
                        roughness: 1,
                        emissiveIntensity: 1,
                        emissiveColor: Color3.Black(),
                        albedoColor: Color4.Black(),
                        alphaTest: 1
                    }
                    hide = true
                }
            }
            else {
                videoMat = {
                    castShadows: false,
                    metallic: 0,
                    roughness: 1,
                    emissiveIntensity: 1,
                    emissiveColor: Color3.Black(),
                    albedoColor: Color4.Black(),
                    alphaTest: 1
                }
                hide = true
            }

            Material.deleteFrom(VideoScreens.S1)
            Material.setPbrMaterial(VideoScreens.S1, videoMat)

            if (hide) {
                VideoScreens.Hide()
            }
            else {
                VideoScreens.Show()
            }
        }
    })

    SHOW_MGR.addVideoStatusChangeListener(new showMgmt.VideoChangeStatusListener((oldStatus: number, newStatus: number) => {

        try {
            logger.debug("SHOW_MGR.addVideoStatusChangeListener", " fired", oldStatus, newStatus)
        } catch (error) {
            console.log("Logger error: " + error)
        }

        switch (newStatus) {
            case VideoState.VS_LOADING:

                break;
        }
    }))

    //example of how to extend the action by setting processExt callback
    const pauseHandler: showMgmt.ShowPauseAllActionHandler
        = SHOW_MGR.actionMgr.getRegisteredHandler<showMgmt.ShowPauseAllActionHandler>(showMgmt.ShowPauseAllActionHandler.DEFAULT_NAME)

    pauseHandler.addOnProcessListener((action: showMgmt.ActionParams<string>, showActionMgr: showMgmt.ShowActionManager): boolean => {
        const METHOD_NAME = "addOnProcessListener"

        try {
            pauseHandler.logger.debug(METHOD_NAME, "called", action)
        } catch (error) {
            console.log("Logger error: " + error)
        }

        //pause actions goes here
        //some actions "stop" is a play or hide or show or stop

        return true
    })

    //example of how to extend the action by setting processExt callback
    const stopHandler: showMgmt.ShowStopAllActionHandler
        = SHOW_MGR.actionMgr.getRegisteredHandler<showMgmt.ShowStopAllActionHandler>(showMgmt.ShowStopAllActionHandler.DEFAULT_NAME)

    stopHandler.addOnProcessListener((action: showMgmt.ActionParams<string>, showActionMgr: showMgmt.ShowActionManager): boolean => {
        const METHOD_NAME = "addOnProcessListener"

        try {
            stopHandler.logger.debug(METHOD_NAME, "called", action)
        } catch (error) {
            console.log("Logger error: " + error)
        }

        //stop actions goes here
        //some actions "stop" is a play or hide or show or stop

        return true
    })

    //STARTING RUN OF SHOW

    const runOfShow = new showMgmt.RunOfShowSystem(SHOW_MGR)
}