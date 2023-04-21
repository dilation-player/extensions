import __cfg from './config';
import './style.css';

// ====================================================
// Class {Panel}
// ====================================================
class Panel {
  context: any;
  isMouseIn: boolean = false;
  panelTime: any = null;

  constructor({ context }: any) {
    context.$panel = this;
    this.context = context;
    this.config();
  }

  config() {
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
    this.isMouseIn = false;
    this.panelTime = null;
    let cfg = this.context.$config;
    let player = cfg.node('player');
    let container = cfg.node('container');

    // Event when hover on player/container/panel
    container.listen('mousemove', () => {
      this.open();
      this.isMouseIn = true;
    });

    // Event when out on player/container/panel
    container.listen('mouseleave', () => {
      this.close();
      this.isMouseIn = false;
    });

    // Event when player pause or ended
    player.listen('pause ended', () => {
      this.open();
    });

    // Event when player pause or ended
    player.listen('play', () => {
      if (!this.isMouseIn) {
        this.close();
      }
    });

    return this;
  }

  /**
   * Hidden
   */
  close() {
    let c = this.context.$config;
    let elPanel = c.node('panel');
    let container = c.node('container').dom();
    let player = c.node('player').dom();

    if (!player.paused) {
      elPanel.active(false);
      this.context.$event.trigger('dp.panel.hide');

      if (this.isMouseIn) {
        container.style.cursor = "none";
        //elContainer.addClass('hidden-cursor');
      } else {
        container.style.cursor = "default";
        //elContainer.removeClass('hidden-cursor');
      }
    }
  }

  /**
   * open
   */
  open() {
    let c = this.context.$config;
    let elPanel = c.node('panel');
    let container = c.node('container').dom();

    window.clearTimeout(this.panelTime);
    elPanel.active(true);
    container.style.cursor = "default";
    // elContainer.removeClass('hidden-cursor');
    this.context.$event.trigger('dp.panel.show');

    this.panelTime = window.setTimeout(() => {
      this.close();
    }, 2000);
  }
}

export default Panel;