import { AudioSource, Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { AudioEntity } from "./audioEntity";

export class AudioManager {

  private static launchSounds: AudioEntity[] = []
  private static boomSounds: AudioEntity[] = []
  private static crackleSounds: AudioEntity[] = []

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
  }

  static playLaunchSounds(_position:Vector3): void {
    AudioManager.launchSounds[Math.floor(Math.random()*AudioManager.launchSounds.length)].playSound(_position)
  }

  static playBoomSounds(_position:Vector3): void {
    AudioManager.boomSounds[Math.floor(Math.random()*AudioManager.boomSounds.length)].playSound(Vector3.add(_position,Vector3.create(0,-4,0)))
  }

  static playCrackleSounds(_position:Vector3): void {
    AudioManager.crackleSounds[Math.floor(Math.random()*AudioManager.crackleSounds.length)].playSound(_position)
  }
} 