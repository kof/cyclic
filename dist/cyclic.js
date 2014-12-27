!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.cyclic=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

/**
 * Cyclic is an api for creating single or bidirectional bindings between any kind of objects.
 *
 * @copyright Oleg Slobodskoi 2014
 * @website https://github.com/kof/cyclic
 * @license MIT
 */

module.exports = require('./lib')

},{"./lib":4}],2:[function(require,module,exports){
'use strict'

var Model = require('./model')

var objects = []
var bindingsMap = {}
var modelsMap = {}

/**
 * Binding contructor.
 *
 * @param {Cycle} cycle
 * @param {Model} model
 * @param {String} prop
 * @api private
 */
function Binding(cycle, model, prop) {
    this.cycle = cycle
    this.model = model
    this.prop = prop
}

module.exports = Binding

/**
 * Create a Binding instance.
 *
 * @param {Cycle} cycle
 * @param {Object} object
 * @param {String} prop
 * @return {Binding}
 * @api public
 */
Binding.create = function (cycle, object, prop) {
    var objectIndex = objects.indexOf(object)
    var binding

    // Check if we have already a binding for this object.prop.
    if (objectIndex >= 0) {
        binding = bindingsMap[objectIndex][prop]
    }

    if (binding) return binding

    var model
    // Check if we have already a model for this object.
    if (objectIndex >= 0) {
        model = modelsMap[objectIndex]
    }

    if (objectIndex == -1) {
        objects.push(object)
        objectIndex = objects.length - 1
    }

    if (!model) {
        model = new Model()
        modelsMap[objectIndex] = model
        cycle.add(model)
    }

    binding = new Binding(cycle, model, prop)
    if (!bindingsMap[objectIndex]) bindingsMap[objectIndex] = {}
    bindingsMap[objectIndex][prop] = binding
    Binding.defineProperty(object, prop, model)

    return binding
}

/**
 * Create getter/setter connected to the model.
 *
 * @param {Object} object
 * @param {String} prop
 * @param {Model} model
 * @api private
 */
Binding.defineProperty = function (object, prop, model) {
    // Don't loose the value if already defined.
    if (object[prop] != null) model.set(prop, object[prop])
    Object.defineProperty(object, prop, {
        enumerable: true,
        get: function () {
            return model.get(prop)
        },
        set: function (value) {
            model.set(prop, value)
        }
    })
}

/**
 * Bind current object to some other one.
 *
 * Options:
 *   - `transform` returned value will be applied, gets a value as a param
 *   - `changed` callback with new value (after transformation) as a param
 *
 * @param {Object} object
 * @param {String} prop
 * @param {Object} [options]
 * @api public
 */
Binding.prototype.to = function (object, prop, options) {
    options || (options = {})
    var binding = Binding.create(this.cycle, object, prop)

    this.model.on('change:' + this.prop, function (value) {
        if (options.transform) value = options.transform(value)
        binding.model.set(prop, value)
        if (options.changed) options.changed(value)
    }.bind(this))

    return binding
}

},{"./model":5}],3:[function(require,module,exports){
'use strict'

/**
 * Cycle class controls models and applies changes.
 * Usually you want to have just one instance within your application which will
 * be in charge of all models.
 *
 * @api public
 */
function Cycle() {
    this.models = {}
}

module.exports = Cycle

/**
 * Add a model to the cycle.
 *
 * @param {Model} model
 * @return {Cycle}
 * @api public
 */
Cycle.prototype.add = function (model) {
    this.models[model.id] = model

    return this
}

/**
 * Run call might be expensive, so we iterate only over models which has changed.
 * You might want to call `run` on every requestAnimationFrame.
 *
 * @return {Cycle}
 * @api public
 */
Cycle.prototype.run = function () {
    for (var id in this.models) {
        var model = this.models[id]
        if (model.isDirty) model.apply()
    }

    return this
}

},{}],4:[function(require,module,exports){
'use strict'

exports.Model = require('./model')
exports.Binding = require('./Binding')
exports.Cycle = require('./cycle')

var cycle = new exports.Cycle()

/**
 * Run the cycle.
 *
 * @return {Cycle}
 * @api public
 */
exports.run = cycle.run.bind(cycle)

/**
 * Create a binding.
 *
 * @param {Object} object
 * @param {String} prop
 * @return {Binding}
 * @api public
 */
exports.bind = function (object, prop) {
    return exports.Binding.create(cycle, object, prop)
}

},{"./Binding":2,"./cycle":3,"./model":5}],5:[function(require,module,exports){
'use strict'

var Emitter = require('component-emitter')

var uid = 0

/**
 * Model constructor for objects which can be potentially cyclic.
 *
 * @param {Object} [object]
 * @api public
 */
function Model(object) {
    this.id = ++uid
    this.object = object || {}
    this.changed = {}
    // Is true when there are changes to be applied to object.
    this.isDirty = false
}

Emitter(Model.prototype)
module.exports = Model

/**
 * Get attribute value.
 *
 * @param {String} name
 * @return {Mixed}
 * @api public
 */
Model.prototype.get = function (name) {
    return this.object[name]
}

/**
 * Schedule attribute value change. Value is applied once .apply method is called.
 * This allows us to avoid cyclic dependencies.
 *
 * @param {String} name
 * @param {Mixed} value
 * @param {Boolean} [silent] will set the attribute directly with no schedule and no event
 * @return {Model}
 * @api public
 */
Model.prototype.set = function (name, value, silent) {
    if (silent || this.object[name] === value) {
        this.object[name] = value
        return this
    }

    this.changed[name] = value
    this.isDirty = true

    return this
}

/**
 * In case model gets serialized by JSON.stringify or just as an object getter.
 *
 * @return {Object}
 * @api public
 */
Model.prototype.toJSON = function () {
    return this.object
}

/**
 * Apply changes to object, emit "change" events.
 *
 * @return {Model}
 * @api private
 */
Model.prototype.apply = function () {
    var changed = this.changed
    this.changed = {}
    this.isDirty = false

    for (var name in changed) {
        var value = changed[name]
        this.object[name] = value
        this.emit('change:' + name, value, this)
    }

    return this
}

},{"component-emitter":6}],6:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}]},{},[1])(1)
});