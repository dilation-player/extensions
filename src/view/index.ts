import __cfg from './config';
import {helper} from '@dilation-player/utils';
import './style.css';

class View {
  context: any;

  constructor({context}: any) {
    this.context = context;
    this.config();
  }

  config(){
    let config = {...__cfg};

    let custom = this.context.config;
    if (custom.view !== undefined) config.view = custom.view;
    if (custom.size !== undefined) config.size = {
      ...__cfg.size,
      ...custom.size
    };
    if (custom.poster !== undefined) config.poster = custom.poster;
    this.context.$config.set(config);
  }

  resize(){
    let elRoot = this.context.$config.node('root');
    let sizeConfig = this.context.$config.get('size');

    if (sizeConfig.height !== undefined) {
      elRoot.css({ height: sizeConfig.height });

      if (sizeConfig.width !== undefined) {
        elRoot.css({ width: sizeConfig.width });
      } else {
        elRoot.css({ width: (elRoot.height() / sizeConfig.rate) + 'px' });
      }
    } else {
      elRoot.css({ width: sizeConfig.width });

      if (sizeConfig.height !== undefined) {
        elRoot.css({ height: sizeConfig.height });
      } else {
        elRoot.css({ height: (elRoot.width() * sizeConfig.rate) + 'px' });
      }
    }
  }

  async complete(){
    let elRoot = this.context.$config.node('root');
    let viewConfig = this.context.$config.get('view');
    let posterUrl = this.context.$config.get('poster');
    let player = this.context.$config.node('player');

    this.context.$event.trigger('dp.view.beforeRender');

    // Render size
    elRoot.css({ maxWidth: '100%' });

    this.resize();

    // Read content in template
    if (!viewConfig.content) {
      if (viewConfig.import) {
        elRoot.html(this.context.$lg.get('app.loading'));
        let response = await this.loadTemplate();
        let content = this.replace(response);
        elRoot.html(content);
      }
    } else {
      let content = this.replace(viewConfig.content);
      elRoot.html(content);
    }

    // Render the poster for video
    if (posterUrl) {
      player.dom().poster = posterUrl;
    }

    this.context.$event.trigger('dp.view.rendered');

    // Listen event window resize
    helper.node(window).listen('resize', () => {
      this.resize();
    });

    return true;
  }

  /**
   * Load template
   * @return {Promise<any>}
   */
  async loadTemplate() {
    let viewConfig = this.context.$config.get('view');

    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', viewConfig.import);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }

  /**
   * replace
   * @return string
   */
  replace(content: any) {
    return content;
  }
}

export default View;