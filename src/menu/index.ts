import { helper } from "@dilation-player/utils";
import __cfg from './config';
import './style.css';

// ====================================================
// Class {Menu}
// ====================================================
class Menu {
  context: any;
  status: boolean = false;

  /**
   * Constructor
   * @param config
   */
  constructor({ context }: any) {
    this.context = context;
    this.context.$menu = this;
    this.config();
  }

  config(){
    let config: any = {
      ...__cfg
    };
    let custom = this.context.config.menu;

    if (custom === false) {
      config.menu = false;
    } else if (custom !== undefined) {
      config.menu = {
        ...__cfg.menu,
        ...custom
      }
    }

    this.context.$config.set(config);
  }

  setup() {
    this.context.$event.listen('dp.view.rendered', () => {
      this.render();
    });
  }

  /**
   * Render menu
   * @param config
   * @return {Menu}
   */
  render() {
    this.status = true;

    let menuList = this.context.$config.get('menu');
    let elMenuList = this.context.$config.node('menuList');

    if (menuList === false) {
      this.status = false;
      return this;
    }

    let menuItemClass = this.context.$config.getEl('menuItem').replace('.', '');

    for (let name in menuList) {
      let div = document.createElement('div');
      let n = helper.node(div);
      div.classList.add(menuItemClass);
      div.setAttribute('dp-menu:name', name);
      div.innerHTML = this.context.$lg.get(menuList[name].text);
      elMenuList.append(div);
      n.listen('click', () => {
        this.execute(n, name);
      });
    }

    this.events();

    return this;
  }

  /**
   * Open menu
   * @param config
   * @return {Menu}
   */
  open(event: any) {
    if (!this.status) {
      return this;
    }

    let elMenu = this.context.$config.node('menu');
    let elMenuList = this.context.$config.node('menuList');

    elMenu.active(true);

    let height = elMenuList.height();
    let width = elMenuList.width();

    let cHeight = window.innerHeight;
    let cWidth = window.innerWidth;

    let left = event.clientX;
    let top = event.clientY;

    if ((cHeight - top) < height) {
      top = cHeight - height;
    }

    if ((cWidth - left) < width) {
      left = cWidth - width;
    }

    elMenuList.css({ left: left + 'px', top: top + 'px' });

    this.context.$event.trigger('dp.menu.show');

    return this;
  }

  /**
   * Close menu
   * @param config
   * @return {Menu}
   */
  close() {
    let elMenu = this.context.$config.node('menu');

    if (!this.status) {
      return this;
    }

    elMenu.active(false);

    this.context.$event.trigger('dp.menu.hide');

    return this;
  }

  /**
   * Event menu
   * @param config
   * @return {Menu}
   */
  events() {
    let elMenuList = this.context.$config.node('menuList');
    let elOverlay = this.context.$config.node('overlay');

    // Event when open context menu
    elOverlay.listen('contextmenu', (e: any) => {
      if (this.status) {
        this.open(e);
      }

      e.preventDefault();
    });

    // Event when click out menu
    helper.node(window).listen('click', (event: any) => {
      if (!elMenuList.has(event.target)
        && !elMenuList.is(event.target)) {
        this.close();
      }
    });

    return this;
  }

  /**
   * execute
   * @param name
   * @return {Menu}
   */
  execute(item: any, name: string) {
    if (!this.status) {
      return this;
    }

    let config = this.context.$config.get('menu.' + name);

    if (config.execute !== undefined) {
      config.execute({ item, menu: this, config });
    }

    return this;
  }
}

export default Menu;