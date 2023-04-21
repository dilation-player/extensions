import __cfg from './config';

export default class Control{
  context: any;
  player: any;
  dom: any;

  constructor({context}: any) {
    context.$control = this;
    this.context = context;
    this.config();
  }

  config(){
    let config = {
      ...__cfg
    };
    let autoplay = this.context.config.autoplay;
    let volume = this.context.config.volume;
    let muted = this.context.config.muted;

    if (volume !== undefined) {
      config.volume = volume;
    }

    if (muted !== undefined) {
      config.muted = muted;
    }

    if (autoplay !== undefined) {
      config.autoplay = autoplay
    }

    this.context.$config.set(config);
  }

  setup(){
    this.context.$event.listen('dp.view.rendered', () => {
      this.player = this.context.$config.node('player');
      this.dom = this.player.dom();
      this.dom.controls = false;
      this.dom.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
      let autoplay = this.context.$config.get('autoplay');
      let muted = this.context.$config.get('muted');
      let volume = this.context.$config.get('volume');
      
      this.autoplay(autoplay);
      this.volume(volume);
      this.muted(muted);
    });
  }

  play(){
    if (this.dom) {
      this.dom.play();
    }

    return this;
  }

  pause(){
    if (this.dom) {
      this.dom.pause();
    }

    return this;
  }

  currentTime(time: any) {
    if (time === undefined) return this.dom.currentTime;
    
    if (isNaN(time)) {
      time = time.split(':');

      if (time.length === 3) {
        time = time[2] * 1 + time[1] * 60 + time[0] * 3600;
      } else if (time.length === 2) {
        time = time[1] * 1 + time[0] * 60;
      } else {
        time = time[0] * 1;
      }
    }

    this.dom.currentTime = time;

    return this;
  }

  togglePlay() {
    if (!isNaN(this.dom.duration)) {
      if (this.dom.paused) {
        this.dom.play();
      } else {
        this.dom.pause();
      }
    }

    return this;
  }

  isPaused(){
    return this.dom && this.dom.paused;
  }

  isEnded(){
    return this.dom.ended;
  }

  volume(number: any) {
    if (number === undefined) return this.dom.volume;
    this.dom.volume = number;
    return this;
  }

  muted(val: any){
    if (val === undefined) return this.dom.muted;
    this.dom.muted = val;
    return this;
  }

  toggleMute() {
    if (this.dom.muted == true) {
      this.dom.muted = false;
    } else if (this.dom.volume > 0) {
      this.dom.muted = true;
    }

    return this;
  }

  loop(val: any){
    if (val === undefined) return this.dom.loop;
    this.dom.loop = val;
    return this;
  }

  duration(){
    let duration = this.dom.duration;
    if (isNaN(duration)) return 0;
    return duration;
  }

  autoplay(val: any){
    if (val === undefined) return this.dom.autoplay;
    this.dom.autoplay = val;
    return this;
  }

  poster(url: any){
    if (url === undefined) return this.dom.poster;
    this.dom.poster = url;
    return this;
  }

  src(url: any){
    if (url === undefined) return this.dom.src;
    this.dom.src = url;
    return this;
  }

  buffered(){
    return this.dom.buffered;
  }
}
