import __cfg from './config';
import './style.css';

// ====================================================
// Class {Overlay}
// ====================================================
class Overlay {
  context: any;

  /**
   * Constructor
   * @param config
   */
  constructor({ context }: any) {
    context.$overlay = this;
    this.context = context;
    this.config();
  }

  config(){
    this.context.$config.set(__cfg);
  }

  setup() {
    this.context.$event.listen('dp.view.rendered', () => {
      this.render();
    });
  }

  /**
   * Render
   */
  render() {
    let c = this.context.$config;
    let icons = c.get('icons');
    let elLoaderIcon = c.node('loaderOverlayIcon');
    let elPlayerIcon = c.node('playerOverlayIcon');
    let elOverlay = c.node('overlay');
    let player = c.node('player');
    let playerDom = player.dom();

    // default
    elPlayerIcon.html(icons.playerOverlay);
    elLoaderIcon.html(icons.loaderOverlay);

    this.toggle({ loader: false, player: false });

    elOverlay.listen('click', () => {
      this.context.$control.togglePlay();
    });

    // Event when start load data
    player.listen('loadstart', () => {
      this.toggle({ loader: true, player: false });
    });

    // Event when player play
    player.listen('play', () => {
      this.toggle({ loader: isNaN(playerDom.duration), player: false });
    });

    // Event when player pause or ended
    player.listen('pause ended', () => {
      this.toggle({ loader: isNaN(playerDom.duration), player: true });
    });

    // Event when timeupdate
    player.listen('timeupdate ', () => {
      this.toggle({ loader: false, player: playerDom.paused });
    });

    // Event when loaded data
    // Then call display information on screen
    player.listen('loadeddata', () => {
      this.toggle({ loader: false, player: playerDom.paused });
    });

    // Event when loading
    player.listen('waiting', () => {
      this.toggle({ loader: true, player: false });
    });

    player.listen('seeking', () => {
      this.toggle({ loader: true, player: false });
    });

    player.listen('seeked', () => {
      this.toggle({ loader: false, player: playerDom.paused });
    });

    return this;
  }

  /**
   * Show
   * @param config
   */
  toggle(config: any) {
    let c = this.context.$config;
    let e = this.context.$event;
    let elLoaderOverlay = c.node('loaderOverlay');
    let elPlayerOverlay = c.node('playerOverlay');
    let elOverlay = c.node('overlay');
    let isLoaderActive = elLoaderOverlay.isActive();
    let isPlayerActive = elPlayerOverlay.isActive();

    elOverlay.active(false);
    elLoaderOverlay.active(config.loader === true);
    elPlayerOverlay.active(config.player === true);

    // Check event
    if (elLoaderOverlay.isActive() !== isLoaderActive) {
      !isLoaderActive ? e.trigger('dp.overlay.loader.show') : e.trigger('dp.overlay.loader.hide');
    }

    if (elPlayerOverlay.isActive() !== isPlayerActive) {
      !isPlayerActive ? e.trigger('dp.overlay.player.show') : e.trigger('dp.overlay.player.hide');
    }

    return this;
  }
}

export default Overlay;