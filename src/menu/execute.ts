export default {
  /**
   * Exec Loop
   * @return {Menu}
   */
  loop({ item, menu }: any) {
    if (!menu.status) {
      return;
    }

    let c = menu.context.$control;

    if (c.loop()) {
      c.loop(false);
      item.active(false);
    } else {
      c.loop(true);
      item.active(true);
    }

    menu.close();
  },

  /**
   * Exec Copy Video Url
   * @return {Menu}
   */
  copyUrl({ item, config, menu }: any) {
    console.log(item, config); // TODO

    if (!menu.status) {
      return this;
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = menu.context.$config.get('url');
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    menu.close();

    return this;
  }
}