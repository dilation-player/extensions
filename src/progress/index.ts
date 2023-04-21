import { helper } from "@dilation-player/utils";
import __cfg from './config';
import './style.css';

class Progress {
  context: any;
  player: any;
  playerDom: any;
  playing: any;
  loading: any;
  timer: any;
  progressTimerTooltipText: any;
  progressTooltipLine: any;
  progressBar: any;
  
  constructor({ context }: any) {
    context.$progress = this;
    this.context = context;
    this.config();
  }

  config(){
    this.context.$config.set(__cfg);
  }

  setup(){
    this.context.$event.listen('dp.view.rendered', () => {
      let cfg = this.context.$config;
      this.player = cfg.node('player');
      this.playerDom = this.player.dom();
      this.playing = cfg.node('progressPlaying');
      this.loading = cfg.node('progressLoading');
      this.timer = cfg.node('progressTimer');
      this.progressTimerTooltipText = cfg.node('progressTooltipText');
      this.progressTooltipLine = cfg.node('progressTooltipLine');
      this.progressBar = cfg.node('progress');
      this.render();
    });
  }

  display() {
    let current = this.context.$control.currentTime();
    let duration = this.context.$source.totalDuration();
    this.setPlaying(current, duration);
    this.setTimer(current, duration);
  }

  setPlaying(curr: any, duration: any) {
    this.playing.width((curr / duration * 100) + '%');
  }

  setLoading(curr: any, duration: any) {
    this.loading.width((curr / duration * 100) + '%');
  }

  setTimer(curr: any, duration: any) {
    curr = helper.parseTime(curr);
    duration = helper.parseTime(duration);
    this.timer.html(curr + ' / ' + duration);
  }

  showHoverLine(curr: any, duration: any) {
    this.progressTooltipLine.active(true).width((curr / duration * 100) + '%');
  }

  showTime(left: any, time: any) {
    this.progressTimerTooltipText.active(true);
    let totalWidth = this.progressBar.width();
    let width = this.progressTimerTooltipText.width() / 2;
    let tLeft = left;

    if (left > (totalWidth - width - 2)) {
      tLeft = totalWidth - width - 2;
    } else if (left < (width + 2)) {
      tLeft = width + 2;
    }

    let parseTime = helper.parseTime(time);
    this.progressTimerTooltipText.css('left', tLeft + 'px').text(parseTime);
  }

  render() {
    // Event when timeupdate
    this.player.listen('timeupdate', () => {
      this.display();
    });

    // Event when loaded data
    // Then call display information on screen
    this.player.listen('loadeddata', () => {
      this.display();
    });

    this.player.listen('durationchange progress', () => {
      this.setLoading(this.context.$control.buffered().end(0), this.context.$source.totalDuration());
    });

    // Event when click on progress bar
    // Then get position of mouse and count the time go to
    this.progressBar.listen("click", (e: any) => {
      let duration = this.context.$source.totalDuration();

      if (duration) {
        let offset = this.progressBar.offset();
        let left = (e.pageX - offset.left);
        let totalWidth = this.progressBar.width();
        let percentage = (left / totalWidth);
        let vidTime = duration * percentage;
        this.context.$control.currentTime(vidTime);
        this.setPlaying(left, totalWidth);
      }
    });

    // Event when move on progress
    // Then get position of mouse, count the time go to and get information
    this.progressBar.listen("mousemove", (e: any) => {
      let duration = this.context.$source.totalDuration();

      if (duration) {
        let offset = this.progressBar.offset();
        let left = (e.pageX - offset.left);
        let totalWidth = this.progressBar.width();
        let percentage = (left / totalWidth);
        let time = duration * percentage;

        // Set position for image
        this.showTime(left, time);
        this.showHoverLine(left, totalWidth);
        this.context.$event.trigger('dp.progress.tooltip.show', { detail: { left, time } });
      } else {
        this.progressTimerTooltipText.active(false);
        this.progressTooltipLine.active(false);
        this.context.$event.trigger('dp.progress.tooltip.hide');
      }
    });

    this.progressBar.listen("mouseout", () => {
      this.progressTimerTooltipText.active(false);
      this.progressTooltipLine.active(false);
      this.context.$event.trigger('dp.progress.tooltip.hide');
    });

    return this;
  }
}

export default Progress;