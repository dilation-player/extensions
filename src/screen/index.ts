import { helper } from '@dilation-player/utils';
import __cfg from './config';
import './style.css';

// ====================================================
// Class {Screen}
// ====================================================
class ControlScreen {
  context: any;
  container: any;
  root: any;
  icons: any;
  screenConfig: any;
  state: any;

  /**
   * Constructor
   * @param app
   */
  constructor({context}: any) {
    context.$screen = this;
    this.context = context;
    this.config();
  }

  config(){
    let config = {
      ...__cfg
    };
    let screen = this.context.config.screen;

    if (screen !== undefined) {
      config.screen = {
        ...__cfg.screen,
        ...screen
      }
    }

    this.context.$config.set(config);
  }

  setup(){
    this.config();
    this.context.$event.listen('dp.view.rendered', () => {
      let c = this.context.$config;
      this.container = c.node('container');
      this.root = c.node('root');
      this.icons = c.get('icons');
      this.screenConfig = c.get('screen');
      this.state = {
        actual: ''
      };

      this.render();
    });
  }

  display(option: any){
    this.handleFullScreen(option);
    this.handleMediumScreen(option);
    this.handleNormalScreen(option);
    let isFullScreen = document.fullscreenEnabled;

    if (option == 'medium' || option == 'normal') this.state.default = option;

    if (option == 'full' && isFullScreen) {
      this.context.$event.trigger('dp.screen.change', {detail: this.state.default});
    } else {
      this.context.$event.trigger('dp.screen.change', {detail: option});
    }
  }

  handleFullScreen(option: any) {
    if (!this.screenConfig.options.includes('full') || option !== 'full') return;

    let isFullScreen = document.fullscreenEnabled;
    let container = this.container.dom();

    container.requestFullScreen = container.requestFullScreen || container.webkitRequestFullScreen || container.mozRequestFullScreen || function () {
      return false;
    };

    // document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () {
    //   return false;
    // };

    if (isFullScreen)document.exitFullscreen();
    else container.requestFullScreen();

    return this;
  }

  handleMediumScreen(option: any) {
    if (option !== 'medium') return;
    this.state.actual = option;
    return this;
  }

  handleNormalScreen(option: any) {
    if (option !== 'normal') return;
    this.state.actual = option;
    return this;
  }

  handleIcon(){
    let elBtnFullScreen = this.context.$config.node('controlFullScreen');
    let elBtnActualScreen = this.context.$config.node('controlActualScreen');

    // For full button
    // let isFull = document.fullscreenElement
    //     || document.mozFullScreenElement
    //     || document.webkitFullscreenElement;
    let isFullScreen = document.fullscreenEnabled || false;

    if (isFullScreen) {
      elBtnFullScreen.html(this.icons.actualScreen);
      elBtnActualScreen.hide();
    } else {
      elBtnFullScreen.html(this.icons.fullScreen);
      elBtnActualScreen.show();
    }

    // For actual button
    if (this.state.actual == 'normal') {
      elBtnActualScreen.html(this.icons.mediumScreen);
    } else {
      elBtnActualScreen.html(this.icons.smallScreen);
    }
  }

  render(){
    let elBtnFullScreen = this.context.$config.node('controlFullScreen');
    let elBtnActualScreen = this.context.$config.node('controlActualScreen');

    if (this.screenConfig.options.includes('full')) {
      // Event when click on button fullscreen
      // Then call to check full or cancel
      elBtnFullScreen.active(true).listen('click', () => {
        this.display('full');
      });

      helper.node(document).listen("fullscreenchange webkitfullscreenchange mozfullscreenchange", () => {
        this.handleIcon();
      });
    }

    if (this.screenConfig.options.includes('normal') && this.screenConfig.options.includes('medium')) {
      // Event when click on button actual button
      // Then call to check full or cancel
      elBtnActualScreen.active(true).listen('click', () => {
        this.display(this.state.actual == 'normal' ? 'medium' : 'normal');
      });
    }

    this.context.$event.listen('dp.screen.change', () => {
      this.handleIcon();
    });

    this.display(this.screenConfig.default);
  }
}

export default ControlScreen;