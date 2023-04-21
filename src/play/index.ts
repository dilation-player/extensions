import __cfg from './config';

export default class Play {
  context: any;
  
  constructor({ context }: any) {
    this.context = context;
    this.config();
  }

  config(){
    this.context.$config.set(__cfg);
  }

  setup(){
    this.context.$event.listen('dp.view.rendered', () => {
      this.render();
    });
  }

  render() {
    let cfg = this.context.$config;
    let player = cfg.node('player');
    let btn = cfg.node('controlPlayPause');
    let icons = cfg.get('icons');
    let c = this.context.$control;

    /**
     * Helper
     * @type {{toggle: toggle, makeIcon: makeIcon}}
     */
    let helper = {
      /**
       * Make icon
       */
      makeIcon: function () {
        if (c.isPaused()) {
          btn.html(icons.play);
        } else {
          btn.html(icons.pause);
        }
      }
    };

    // Event when click on button play/pause
    btn && btn.listen('click', () => {
      c.togglePlay();
    });

    // Event when click on player
    player.listen('click', () => {
      c.togglePlay();
    });

    // Event when player play
    player.listen('play', () => {
      helper.makeIcon();
    });

    // Event when player pause or ended
    player.listen('pause ended', () => {
      helper.makeIcon();
    });

    player.listen('waiting', () => {
      // btn.html(icons.play);
    });

    player.listen('seeking', () => {
      btn.html(icons.play);
    });

    player.listen('seeked', () => {
      helper.makeIcon();
    });

    // Init display icon in button play/pause
    helper.makeIcon();

    return this;
  }
};

