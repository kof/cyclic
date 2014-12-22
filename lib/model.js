'use strict'

var Emitter = require('component-emitter')

var uid = 0

function Model(attributes) {
    this.id = ++uid
    this.attributes = attributes
    this.changed = {}
    this.isDirty = false
}

Emitter(Model.prototype)
module.exports = Model

Model.prototype.get = function (name) {
    return this.attributes[name]
}

Model.prototype.set = function (name, value) {
    if (this.attributes[name] === value) return this
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
