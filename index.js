'use strict'

exports.Model = require('./lib/model')
exports.Binding = require('./lib/Binding')
exports.Cycle = require('./lib/cycle')

var cycle = new exports.Cycle()

exports.run = cycle.run.bind(cycle)

exports.bind = function (object, prop) {
    return exports.Binding.create(cycle, object, prop)
}
