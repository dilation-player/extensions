import { Node } from '@dilation-player/utils';

// ====================================================
// Class {Config}
// ====================================================
class Config {
  context: any;
  config: any;
  cache: any;

  /**
   * Constructor
   * @param config
   */
  constructor({ context }: any) {
    context.$config = this;
    this.context = context;
    this.config = {
      elements: {},
      icons: {}
    };
    this.cache = {
      node: {},
      config: {}
    };
  }

  setup(){
    this.set({
      elements: this.context.config.elements,
      icons: this.context.config.icons
    });
  }

  /**
   * Apply
   * @param {*} config 
   */
  set(config: any) {
    let newCg = this.config;

    if (config.elements) newCg.elements = {
      ...newCg.elements,
      ...config.elements
    };

    if (config.icons) newCg.icons = {
      ...newCg.icons,
      ...config.icons
    };

    // Config for elements
    this.config = {
      ...config,
      ...newCg
    };

    return this;
  }

  /**
   * Access array
   * @param key
   * @return {*}
   */
  access(key: any) {
    let config = this.config;
    let keys = key.split('.');

    for (let i in keys) {
      if (config[keys[i]] === undefined) {
        return undefined;
      }

      config = config[keys[i]];
    }

    return config;
  }

  /**
   * Get config
   * @param key
   * @return mixed
   */
  get(key: any, cache: any) {
    if (cache) {
      if (!this.cache.config[key]) {
        this.cache.config[key] = this.access(key);
      }

      return this.cache.config[key];
    }

    return this.access(key);
  }

  /**
   * Get element config
   * @param key
   * @return mixed
   */
  getEl(key: any, cache: any) {
    return this.get('elements.' + key, cache);
  }

  /**
   * Get node
   * @param key
   * @param cache
   * @return {*|undefined}
   */
  node(key: any, cache: any) {
    cache = cache !== undefined ? cache : true;
    let config = this.get('elements.' + key, cache);

    if (!config) return;

    // Check if is object elements
    if (key === 'root' && (this.cache.node[key] === undefined || !cache)) {
      this.cache.node[key] = new Node(config);
    }
    // Check get dom is true and dom is created
    // Then return dom in cache
    else if (typeof config === 'string') {
      if (this.cache.node[key] === undefined || !cache) {
        this.cache.node[key] = this.cache.node['root'].find(config);
      }
    }

    return this.cache.node[key];
  }
}

export default Config;