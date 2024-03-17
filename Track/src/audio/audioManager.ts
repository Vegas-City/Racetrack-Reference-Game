import { AudioSource, Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { AudioEntity } from "./audioEntity";
import { PartyManager } from "../party/partyManager";

export class AudioManager {

  private static launchSounds: AudioEntity[] = []
  private static boomSounds: AudioEntity[] = []
  private static crackleSounds: AudioEntity[] = []
  public static musicTracks: AudioEntity[] = []

  constructor() {
    // Building
    AudioManager.launchSounds = [
      new AudioEntity("audio/FireWorks/Candle11.mp3", 0.5, 4),
      new AudioEntity("audio/FireWorks/Candle13.mp3", 0.5, 4),
      new AudioEntity("audio/FireWorks/Candle14.mp3", 0.5, 4),
      new AudioEntity("audio/FireWorks/Candle42.mp3", 0.5, 4),
      new AudioEntity("audio/FireWorks/Rocket6.mp3", 0.5, 4),
      new AudioEntity("audio/FireWorks/Rocket7.mp3", 0.5, 4),
      new AudioEntity("audio/FireWorks/Rocket11.mp3", 0.5, 4)
    ]
    AudioManager.boomSounds = [
      new AudioEntity("audio/FireWorks/BoomSingle1.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/BoomSingle2.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/BoomSingle3.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/Explode1.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/Explode3.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/Explode4.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/Explode5.mp3", 1, 3),
      new AudioEntity("audio/FireWorks/Explode6.mp3", 1, 3)
    ]
    AudioManager.crackleSounds = [
      new AudioEntity("audio/FireWorks/Crackles1.mp3", 1, 5),
      new AudioEntity("audio/FireWorks/Crackles2.mp3", 1, 5)
    ]

    AudioManager.musicTracks = [
      new AudioEntity("audio/Music/track1.mp3", 1, 1, true),
      new AudioEntity("audio/Music/track2.mp3", 1, 1, true),
      new AudioEntity("audio/Music/track3.mp3", 1, 1, true),
      new AudioEntity("audio/Music/track4.mp3", 1, 1, true),
      new AudioEntity("audio/Music/background.mp3", 1, 1, true),
      new AudioEntity("audio/Music/RT_music.mp3", 1, 1, true),
    ]
  }

  static playLaunchSounds(_position: Vector3): void {
    AudioManager.launchSounds[Math.floor(Math.random() * AudioManager.launchSounds.length)].playSound(_position)
  }

  static playBoomSounds(_position: Vector3): void {
    AudioManager.boomSounds[Math.floor(Math.random() * AudioManager.boomSounds.length)].playSound(Vector3.add(_position, Vector3.create(0, -4, 0)))
  }

  static playCrackleSounds(_position: Vector3): void {
    AudioManager.crackleSounds[Math.floor(Math.random() * AudioManager.crackleSounds.length)].playSound(_position)
  }

  static playMusic(_trackNumber: number): void {
    // Stop all other background music tracks
    AudioManager.stopAllMusic()

    let playMusic:boolean = true


    // Check to see if the ceremony music is playing
    let currentDate: number = Date.now()

    if (PartyManager.instance) {
      if (currentDate > PartyManager.instance.ceremonyMusicStart && currentDate < PartyManager.instance.ceremonyMusicEnd && _trackNumber == 4) {
        // play ceremony instead of background
        _trackNumber = 5
      }

      if (currentDate> PartyManager.instance.djStartTime && currentDate < PartyManager.instance.djEndTime) {
        //block all music
        playMusic = false
      }
    }

    if(playMusic){
      AudioManager.musicTracks[_trackNumber].playSound(Vector3.One())
    }
  }

  static stopAllMusic(): void {
    AudioManager.musicTracks.forEach(audioEntity => {
      audioEntity.stopAll()
    });
  }
} 