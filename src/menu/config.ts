import exe from './execute';

export default {
  elements: {
    menu: '.dp-menu',
    menuList: '.dp-menu-list',
    menuItem: '.dp-menu-item',
    menuItemLoop: '.dp-menu-item-loop',
    menuItemCopyUrl: '.dp-menu-item-copy-url'
  },
  menu: {
    loop: {
      text: 'menu.loop',
      element: 'menuItemLoop',
      execute: function (context: any) {
        exe.loop(context);
      }
    },

    copyUrl: {
      text: 'menu.copy_url',
      element: 'menuItemCopyUrl',
      execute: function (context: any) {
        exe.copyUrl(context);
      }
    }
  }
};