import { Howl } from "howler";

class SoundManagerClass {
  private sounds: Record<string, Howl> = {};
  private initialized = false;
  private muted = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Create sounds with inline generated audio (Web Audio fallback)
    // These will be replaced with actual audio files when available
    this.sounds.crack = new Howl({
      src: ["/sounds/crack.mp3"],
      volume: 0.5,
      onloaderror: () => {
        // Silently fail - sound is optional enhancement
      },
    });

    this.sounds.break = new Howl({
      src: ["/sounds/break.mp3"],
      volume: 0.6,
      onloaderror: () => {},
    });

    this.sounds.chime = new Howl({
      src: ["/sounds/chime.mp3"],
      volume: 0.4,
      onloaderror: () => {},
    });

    this.sounds.hover = new Howl({
      src: ["/sounds/hover.mp3"],
      volume: 0.15,
      onloaderror: () => {},
    });
  }

  play(name: string) {
    if (this.muted || !this.initialized) return;
    this.sounds[name]?.play();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      Object.values(this.sounds).forEach((s) => s.stop());
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}

export const SoundManager = new SoundManagerClass();
