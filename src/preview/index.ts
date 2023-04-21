import __cfg from './config';
import './style.css';

class Preview {
  context: any;
  preview: any;

  constructor({context}: any){
    context.$preview = this;
    this.context = context;
    this.config();
  }

  config(){
    let config = {
      ...__cfg
    };
    let preview = this.context.config.preview;

    if (preview !== undefined) {
      config.preview = preview;
    }

    this.context.$config.set(config);
  }

  setup(){
    this.context.$event.listen('dp.view.rendered', () => {
      this.render();
    });
  }

  add(preview: any){
    if (preview) this.context.$config.set({
      preview
    });

    this.preview = this.context.$config.get('preview');
  }

  render(){
    let cfg = this.context.$config;
    let progressTooltipImage = cfg.node('progressTooltipImage');
    this.preview = cfg.get('preview');
    let progressBar = cfg.node('progress');

    // Listen event
    this.context.$event.listen('dp.progress.tooltip.show', (data: any) => {
      // Get preview
      let p = [];
      let time = Math.floor(data.detail.time);

      if (this.preview) {
        p = this.preview.data.filter((item: any) => item.time <= time && (item.time + this.preview.step) >= time);
      }

      if (p.length) {
        let totalWidth = progressBar.width();
        let width = progressTooltipImage.width() / 2;
        let iLeft = data.detail.left;
        if (data.detail.left > (totalWidth - width)) {
          iLeft = totalWidth - width;
        } else if (data.detail.left < width) {
          iLeft = width;
        }

        progressTooltipImage.css({
          left: iLeft + 'px',
          backgroundImage: `url(${p[0].src})`
        });
        progressTooltipImage.active(true);
      } else {
        progressTooltipImage.active(false);
      }
    });

    this.context.$event.listen('dp.progress.tooltip.hide', () => {
      progressTooltipImage.active(false);
    });
  }
}

export default Preview;