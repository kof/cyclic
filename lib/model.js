'use strict'

var Emitter = require('component-emitter')

var uid = 0

function Model(object) {
    this.id = ++uid
    this.object = object
    this.changed = {}
}

Emitter(Model.prototype)
module.exports = Model

Model.prototype.set = function (name, value) {
    this.changed[name] = value

    return this
}

Model.prototype.apply = function (isCyclic) {
    for (var name in this.changed) {
        var newValue = this.changed[name]
        var currValue = this.object[name]
        if (currValue === newValue || isCyclic(this.id, name)) continue
        this.object[name] = newValue
        this.emit(name, newValue)
    }

    this.changed = {}

    return this
}
