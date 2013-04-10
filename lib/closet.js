/*globals module*/
/*
*  Closet
*
*  Wrapper for HTML5 localStorage
*
*  ## Functionality
*
*  - auto detects whether browser supports HTML5 localStorage and
*    gracefully defaults to an in-memory data store when unavailable.
*
*  - localStorage only accepts and returns serialized string
*    objects. Closet automatically manages serialization
*    and deserialization.
*
*  ## Usage
*
#    var Closet = require('lib/closet'),
*        closet = new Closet();
*    closet.setItem('example', {name: 'John Doe', age: 45});
*    closet.setItem('Friday', 5);
*
*    closet.getItem('example');   // {name: 'John Doe', age: 45}
*    closet.getItem('Friday');    // 5
*
*    closet.clear();
*    closet.getItem('example');   // null
*
*
*  ## Modalities
*
*    Not all browser support localStorage. If it is supported,
*    Closet will use it, otherwise it will use a temporary,
*    in-memory data store. Normally, this is automatically determined
*    by Closet. However, it is possible to force it to use
*    the in-memory data store. This is done by passing in the boolean
*    value true to the useNativeCloset parameter during instanciation.
*
*    In a browser that supports localStorage:
*    var closet = new Closet();
*    closet.storageType();          // 'LocalStorage'
*
*    var closet = new Closet(true);
*    closet.storageType();          // 'Native'
*
*    In a browser that does NOT support localStorage:
*    var closet = new Closet();
*    closet.storageType();          // 'Native'
*
*    var closet = new Closet(true);
*    closet.storageType();          // 'Native'
*
*
*  ## Class methods
*
*    Closet.hasLocalStorage()  // returns a Boolean
*      True if the browser supports HTML5 localStorage
*
*/

var isSecurityError = function(name) {
  // Chrome || Firefox
  return name === 'SECURITY_ERR' || name === 'SecurityError';
};

var Closet = function(useNativeCloset) {
  if (useNativeCloset || !Closet.hasLocalStorage()) {
    return new Closet.NativeStore();
  }

  return new Closet.LocalStore();
};

Closet.hasLocalStorage = function() {
  var storage, result;
  try {
    storage = window.localStorage;
    if ( storage == null ) { return false; }
    storage.setItem('__hasLocalStorage__', 'true');
    result = storage.getItem('__hasLocalStorage__') === 'true';
    storage.removeItem('hasLocalStorage');
    return result;
  } catch(e) {
    if (e.name === 'QUOTA_EXCEEDED_ERR' || isSecurityError(e.name)) {
      return false;
    } else {
      throw e;
    }
  }
};


var storage,  // private data store for Closet.NativeStore
    updateLength;

var findKeys = function(storage, regex) {
  var keys = [];
  regex = new RegExp(regex);
  for (var key in storage) {
    if (storage.hasOwnProperty(key)) {
      if (regex && !regex.test(key)) { continue; }
      keys.push(key);
    }
  }
  return keys;
};

Closet.NativeStore = function() {
  storage = {};

  updateLength = function() {
    var count = 0;
    for (var key in storage) {
      if (storage.hasOwnProperty(key)) { count+= 1; }
    }
    this.length = count;
  };
};

Closet.NativeStore.prototype = {
  length: 0,

  getItem: function(name) {
    return typeof(storage[name]) === 'undefined' ? null : storage[name];
  },

  setItem: function(name, value) {
    storage[name] = value;
    updateLength.call(this);
  },

  removeItem: function(name) {
    delete storage[name];
    updateLength.call(this);
  },

  clear: function() {
    storage = {};
    updateLength.call(this);
  },

  keys: function(regex) {
    return findKeys(storage, regex);
  },

  storageType: function() {
    return 'Native';
  }
};

Closet.LocalStore = function() {

  updateLength = function() {
    this.length = window.localStorage.length;
  };

};

Closet.LocalStore.prototype = {
  length: 0,

  getItem: function(name) {
    try {
      return JSON.parse(window.localStorage.getItem(name));
    } catch (e) {
      return null;
    }
  },

  setItem: function(name, value) {
    var result = window.localStorage.setItem(name, JSON.stringify(value));
    updateLength.call(this);
    return result;
  },

  removeItem: function(name) {
    var result = window.localStorage.removeItem(name);
    updateLength.call(this);
    return result;
  },

  clear: function() {
    var result = window.localStorage.clear();
    updateLength.call(this);
    return result;

  },

  keys: function(regex) {
    return findKeys(window.localStorage, regex);
  },

  storageType: function() {
    return 'LocalStorage';
  }
};

module.exports = Closet;
