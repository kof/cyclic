'use strict'

var Emitter = require('component-emitter')

var uid = 0

/**
 * Model constructor for objects which can be potentially cyclic.
 *
 * @param {Object} [attributes]
 * @api public
 */
function Model(attributes) {
    this.id = ++uid
    this.attributes = attributes || {}
    this.changed = {}
    // Is true when there are changes to be applied to attributes.
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
    return this.attributes[name]
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
    if (silent || this.attributes[name] === value) {
        this.attributes[name] = value
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
    return this.attributes
}

/**
 * Apply changes to attributes, emit "change" events.
 *
 * @return {Model}
 * @api private
 */
Model.prototype.apply = function () {
    for (var name in this.changed) {
        var value = this.changed[name]
        this.attributes[name] = value
        this.emit('change:' + name, value)
    }

    this.changed = {}
    this.isDirty = false

    return this
}
