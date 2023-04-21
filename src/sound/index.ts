import __cfg from './config';
import './style.css';

class Sound {
  context: any;
  volume: any;
  volumeRange: any;
  icons: any;
  player: any;

  constructor({ context }: any) {
    context.$sound = this;
    this.context = context;
    this.config();
  }
  
  config(){
    this.context.$config.set(__cfg);
  }

  setup(){
    this.context.$event.listen('dp.view.rendered', () => {
      let cfg = this.context.$config;
      this.volume = cfg.node('controlVolume');
      this.volumeRange = cfg.node('controlVolumeRange');
      this.icons = cfg.get('icons');
      this.player = cfg.node('player');
      this.render();
    });
  }

  makeIcon() {
    let volume = this.context.$control.volume();
    if (this.context.$control.muted() == true || volume == 0) {
      this.volume.html(this.icons.volumeMute);
    } else if (volume <= 0.5) {
      this.volume.html(this.icons.volume1);
    } else {
      this.volume.html(this.icons.volume2);
    }
  }

  render() {
    // Event click on button
    this.volume.listen('click', () => {
      this.context.$control.toggleMute();
    });

    // Event when change input of range
    // Then call change volume and icon
    this.volumeRange.listen('change', () => {
      let range = this.volumeRange.val();
      this.context.$control.volume(range);
      if (range > 0) this.context.$control.muted(false);
    });

    // Event when volume change
    this.player.listen('volumechange', () => {
      this.volumeRange.val(this.context.$control.volume());
      this.makeIcon();
    });

    // Set volume default
    this.volumeRange.val(this.context.$config.get('volume'));
    this.makeIcon();

    return this;
  }
}

export default Sound;