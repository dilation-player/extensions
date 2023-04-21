import __cfg from './config';
import './style.css';

// ====================================================
// Class {Logo}
// ====================================================
class Logo {
  context: any;
  status: boolean = false;

  /**
   * Constructor
   * @param config
   */
  constructor({context}: any) {
    context.$logo = this;
    this.context = context;
    this.config();
  }

  config(){
    let config: any = {
      ...__cfg
    };
    let custom = this.context.config.logo;

    if (custom === false) {
      config.logo = false;
    } else if (custom !== undefined) {
      config.logo = {
        ...__cfg.logo,
        ...custom
      }
    }

    this.context.$config.set(config);
  }

  setup(){
    this.context.$event.listen('dp.view.rendered', () => {
      this.render();
    });
  }

  /**
   * resizeLogo
   * @return {Logo}
   */
  resize() {
    if (!this.status) {
      return this;
    }

    let elLogo = this.context.$config.node('logo');
    let logoConfig = this.context.$config.get('logo');

    if (logoConfig.height !== undefined) {
      elLogo.css({ height: logoConfig.height });

      if (logoConfig.width !== undefined) {
        elLogo.css({ width: logoConfig.width });
      } else {
        elLogo.css({ width: (elLogo.height() / logoConfig.rate) + 'px' });
      }
    } else {
      elLogo.css({ width: logoConfig.width });

      if (logoConfig.height !== undefined) {
        elLogo.css({ height: logoConfig.height });
      } else {
        elLogo.css({ height: (elLogo.width() * logoConfig.rate) + 'px' });
      }
    }

    this.context.$event.trigger('dp.logo.resize');

    return this;
  }

  /**
   * render
   * @return {Logo}
   */
  render() {
    this.status = true;

    let elLogo = this.context.$config.node('logo');
    let logoConfig = this.context.$config.get('logo');
    let instance = this;

    // Check if logo is hidden
    if (logoConfig === false) {
      this.status = false;
      elLogo.active(false);
      return this;
    }

    elLogo.active(true);
    elLogo.css({ backgroundImage: 'url(\'' + logoConfig.url + '\')' });

    // Event when screen change
    this.context.$event.listen('dp.screen.change', function () {
      instance.resize();
    });

    // Default
    instance.resize();

    return this;
  }
}

export default Logo;