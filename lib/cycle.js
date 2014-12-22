'use strict'

function Cycle() {
    this.models = []
}

module.exports = Cycle

Cycle.prototype.add = function (model) {
    this.models.push(model)

    return this
}

Cycle.prototype.run = function () {
    var changed = {}

    function isCyclic(id, name) {
        var name = id + name
        if (changed[name]) return true
        changed[name] = true
        return false
    }

    this.models.forEach(function (model) {
        model.apply(isCyclic)
    })

    return this
}

