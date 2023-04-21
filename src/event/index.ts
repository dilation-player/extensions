import { helper } from "@dilation-player/utils";

// ====================================================
// Class {Event}
// ====================================================
class Event {
  context: any;
  events: any;

  /**
   * constructor
   */
  constructor({ context }: any) {
    context.$event = this;
    this.context = context;
    this.events = {};
  }

  /**
   * Create event
   * @param name
   * @param parameters
   */
  createEvent(name: string, parameters: any) {
    return new CustomEvent(name, parameters);
  }

  /**
   * Trigger event
   * @param name
   * @param parameters
   */
  trigger(name: string, parameters: any) {
    let dom = this.context.$config.node('root').dom();
    if (!dom) return;
    let event = this.createEvent(name, helper.or(parameters, {}));
    dom.dispatchEvent(event);

    // Check if listen all
    if (this.events['*'] !== undefined) {
      this.events['*'].forEach((element: any) => {
        element({detail: parameters, name});
      });
    }

    return this;
  }

  /**
   * Trigger event
   * @param name
   * @param parameters
   */
  listen(name: any, call: any) {
    if (name == '*') {
      this.events['*'] = this.events['*'] || [];
      this.events['*'].push(call);
    } else {
      let dom = this.context.$config.node('root').dom();
      dom.addEventListener(name, call);
    }
    
    return this;
  }
}

export default Event;