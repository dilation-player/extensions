import { helper } from '@dilation-player/utils';
import __cfg from './config';

class Source {
  context: any;
  player: any;
  playerDom: any;
  source: any;

  constructor({ context }: any) {
    context.$source = this;
    this.context = context;
    this.config();
  }

  config() {
    let config = { ...__cfg };
    let source = this.context.config.source;
    let startAt = this.context.config.startAt;
    let type = this.context.config.type;

    if (source !== undefined) {
      config.source = source;
    }

    if (startAt !== undefined) {
      config.startAt = startAt;
    }

    if (type !== undefined) {
      config.type = type;
    }

    this.context.$config.set(config);
  }

  setup() {
    this.context.$event.listen('dp.view.rendered', () => {
      this.player = this.context.$config.node('player');
      this.playerDom = this.player.dom();
      this.player.html(this.context.$lg.get('app.not_support'));
      this.apply();
    });
  }

  appendSource({src, type}){
    let source = document.createElement('source');
    helper.node(source).attr({ src, type });
    this.playerDom.append(source);
  }

  apply(){
    this.context.$event.trigger('dp.source.rendering');
    this.source = this.context.$config.get('source');
    let at = this.context.$config.get('startAt');
    let type = this.context.$config.get('type');

    if (this.source.meta) {
      // Check if is multi source
      if (this.source.meta.length > 1) {
        this.source.meta.forEach((item) => {
          this.appendSource(item);
        });
      }
      // Case have one source
      else {
        let item = this.source.meta[0];

        // Check if is stream video
        if (item.stream) {
          const mediaSource = new MediaSource();
          let sourceBuffer = null;

          mediaSource.addEventListener("sourceopen", () => {
            if (type == 'video') sourceBuffer = mediaSource.addSourceBuffer(item.type);
            else sourceBuffer = mediaSource.addSourceBuffer(item.type);

            let form: any = {
              headers: {
                range: [0, 1000]
              }
            };

            fetch(item.src, form).then(function (response) {
              return response.arrayBuffer();
            }).then(function (buff) {
              sourceBuffer.appendBuffer(buff);
            }).catch((error) => {
              console.log(error);
            });
          });

          const url = URL.createObjectURL(mediaSource);
          // this.context.$control.src(url);
          this.appendSource({ src: url, type: item.type });
        } else {
          this.context.$control.src(item.src);
        }
      }
    }

    if (at) {
      this.context.$control.currentTime(at);
    }

    this.context.$event.trigger('dp.source.rendered');
  }

  totalDuration() {
    return this.source?.duration || this.context.$control.duration();
  }
}

export default Source;