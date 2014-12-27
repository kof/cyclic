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
