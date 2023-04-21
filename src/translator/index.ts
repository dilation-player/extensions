import __cfg from './config';

// ====================================================
// Class {Translator}
// ====================================================
class Translator {
  context: any;
  languages: any;

  /**
   * Constructor
   * @param config
   */
  constructor({context}: any) {
    context.$lg = this;
    this.context = context;
    this.config();
  }

  config(){
    let config: any = {...__cfg};
    let custom = this.context.config.locale;
    let messages = this.context.config.messages;

    if (custom !== undefined) config.locale = custom;
    if (messages !== undefined) config.messages = messages;

    this.context.$config.set(config);
  }

  setup(){
    let locale = this.context.$config.get('locale');
    let messages = this.context.$config.get('messages');
    this.languages = messages[locale] || {};
  }

  /**
   * Get translate
   * @param key
   * @param attributes
   * @return mixed
   */
  get(key: string, attributes: any) {
    if (attributes == undefined) {
      attributes = {};
    }

    var keys = key.split('.');
    var messages = this.languages;
    let message = messages;

    // Get message format
    for (var i in keys) {
      if (message[keys[i]] == undefined) {
        return key;
      }

      message = message[keys[i]];
    }

    // Get attribute in message format
    for (var attrKey in attributes) {
      if (messages[keys[0]].attributes == undefined) {
        return message;
      }

      if (messages[keys[0]].attributes[attrKey] == undefined) {
        return message;
      }

      var fields = messages[keys[0]].attributes[attrKey];
      var attr = (fields[attributes[attrKey]] != undefined ? fields[attributes[attrKey]] : attributes[attrKey]);
      var regex = new RegExp(':' + attrKey, 'g');
      message = message.replace(regex, attr);
    }

    return message;
  }
}

export default Translator;