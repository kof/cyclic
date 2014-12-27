'use strict'

QUnit.module('Cycle')

test('create cycle', function () {
    var cycle = new cyclic.Cycle()
    deepEqual(cycle.models, {}, 'models is an empty object')
})

test('.add', function () {
    var cycle = new cyclic.Cycle()
    var model = {id: 1}
    cycle.add(model)
    strictEqual(cycle.models[1], model, 'model added')
})


test('.run calls apply', function () {
    var cycle = new cyclic.Cycle()
    var applyCalled
    var model = {
        id: 1,
        apply: function () {
            applyCalled = true
        },
        isDirty: true
    }
    cycle.add(model)
    cycle.run()
    ok(applyCalled, 'apply called on dirty model')

    model.isDirty = false
    applyCalled = false
    cycle.run()
    ok(!applyCalled, 'apply not called')
})
