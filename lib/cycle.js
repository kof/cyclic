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
