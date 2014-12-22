'use strict'

function Cycle() {
    this.models = {}
}

module.exports = Cycle

Cycle.prototype.add = function (model) {
    this.models[model.id] = model

    return this
}

/**
 * Run call might be expensive, so we iterate only over models which has really
 * changed.
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
