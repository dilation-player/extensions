
import { helper } from '@dilation-player/utils';
import __cfg from './config';
import './style.css';

class Subtitle {
  context: any;
  displayList: Array<any> = [];
  displayIndex: Array<any> = [];
  titles: any = {};
  title: any;
  player: any;
  el: any;

  constructor({ context }: any) {
    this.context = context;
    this.config();
  }

  config(){
    let config: any = {...__cfg};
    let subtitles = this.context.config.subtitles;

    if (subtitles !== undefined) {
      config.subtitles = subtitles;
    }

    this.context.$config.set(config);
  }

  setup(){
    this.titles = this.context.$config.get('subtitles');
    this.context.$event.listen('dp.view.rendered', async () => {
      await this.loadMessages(this.context.$config.get('locale'));
      this.player = this.context.$config.node('player');
      this.el = this.context.$config.node('subtitle');
      this.render();
    });
  }

  async end(time: any) {
    let d = [...this.displayList];
    return d.forEach((item, index) => {
      if (item.data.end >= time && item.data.start <= time) return;
      item.el.remove();
      this.displayList.splice(index, 1);
      this.displayIndex.splice(index, 1);
    });
  }

  start(time: any) {
    this.title.messages.forEach((item: any, index: number) => {
      if (item.start <= time && item.end >= time && !this.displayIndex.includes(index)) {
        let div = document.createElement('div');
        let n = helper.node(div);
        if (this.title.styles && this.title.styles[item.person]) n.css(this.title.styles[item.person]);
        n.html(item.content);
        this.el.append(div);
        this.displayList.push({
          el: div,
          data: item
        });
        this.displayIndex.push(index);
      }
    });
  }

  async render() {
    // Add events
    this.player.listen('timeupdate', async () => {
      let time = this.context.$control.currentTime();
      await this.end(time);
      this.start(time);
    });

    this.context.$event.listen('dp.panel.show', () => {
      this.el.active(true);
    });

    this.context.$event.listen('dp.panel.hide', () => {
      this.el.active(false);
    });
  }

  async loadMessages(locale: string) {
    this.title = this.titles.filter((t: any) => t.locale === locale)[0];
    if (!this.title) {
      let src: string = this.title.src;
      let title = await new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', src);
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
      this.title = title;
    }
  }
}

export default Subtitle;