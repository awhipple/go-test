export default class AudioLibrary {
  sounds = {};

  constructor(root = "./sounds/") {
    this.root = root;
  }

  get(name) {
    return this.sounds[name] || this._loadSound(name);
  }

  alias(name, original) {
    this.sounds[name] = this.get(original);
  }

  play(name, options = {}) {
    this.get(name).play(options);
  }

  stop(name) {
    this.get(name).stop();
  }

  _loadSound(name) {
    var sound =  new Sound(this.root + name + ".mp3");
    return this.sounds[name] = sound;
  }

}

class Sound {
  constructor(path) {
    var sound = new Audio();
    sound.src = path;
    sound.setAttribute("preload", "auto");
    
    this.channels = [ sound ];
    this.channelPointer = 0;
  }

  play(options = {}) {
    if ( options.loop ) {
      this.playLoop();
      return;
    } 

    this.channelPointer = (this.channelPointer + 1) % this.channels.length;
    
    if ( !this.channels[this.channelPointer].paused ) {
      this._addChannel();
    }

    this.channels[this.channelPointer].play();
  }

  playLoop() {
    if ( !this.loopAudio ) {
      this.loopAudio = this.channels[0].cloneNode();
      this.loopAudio.loop = true;
    }
    this.loopAudio.play();
  }

  stop() {
    this.channels.forEach(channel => {
      channel.pause();
      channel.currentTime = 0;
    });
    this.loopAudio.pause();
    this.loopAudio.currentTime = 0;
  }

  _addChannel() {
    this.channels.push(this.channels[0].cloneNode());
    this.channelPointer = this.channels.length - 1;
  }
}