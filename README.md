# Closet

[![Build Status](https://travis-ci.org/s-vizzari/closet.png)](https://travis-ci.org/s-vizzari/closet.png)

Wrapper for HTML5 localStorage

## Functionality

- auto detects whether browser supports HTML5 localStorage and
  gracefully defaults to an in-memory data store when unavailable.

- localStorage only accepts and returns serialized string
  objects. Closet automatically manages serialization
  and deserialization.

## Usage
```js
var Closet = require('lib/closet'),
    closet = new Closet();
closet.setItem('example', {name: 'John Doe', age: 45});
closet.setItem('Friday', 5);

closet.getItem('example');   // {name: 'John Doe', age: 45}
closet.getItem('Friday');    // 5

closet.clear();
closet.getItem('example');   // null
```
## Modalities

Not all browser support localStorage. If it is supported,
Closet will use it, otherwise it will use a temporary,
in-memory data store. Normally, this is automatically determined
by Closet. However, it is possible to force it to use
the in-memory data store. This is done by passing in the boolean
value true to the useNativeCloset parameter during instanciation.

In a browser that supports localStorage:
```js
var closet = new Closet();
closet.storageType();          // 'LocalStorage'

var closet = new Closet(true);
closet.storageType();          // 'Native'

In a browser that does NOT support localStorage:
var closet = new Closet();
closet.storageType();          // 'Native'

var closet = new Closet(true);
closet.storageType();          // 'Native'
```

## Class methods
```js
Closet.hasLocalStorage()  // returns a Boolean `true` if the browser supports HTML5 localStorage
```
