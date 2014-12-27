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
