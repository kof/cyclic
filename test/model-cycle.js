'use strict'

QUnit.module('Model-Cycle integration')

test('model1.a->model2.b->model3.c->model1.a', function () {
    var model1 = new cyclic.Model({a: 1})
    var model2 = new cyclic.Model({b: 2})
    var model3 = new cyclic.Model({c: 3})

    model1.on('change:a', function (value) {
        model2.set('b', value + 1)
    })

    model2.on('change:b', function (value) {
        model3.set('c', value + 1)
    })

    model3.on('change:c', function (value) {
        // Close the cycle.
        model1.set('a', 2)
    })

    var cycle = new cyclic.Cycle()
    cycle
        .add(model1)
        .add(model2)
        .add(model3)

    deepEqual(model1.toJSON(), {a: 1}, 'before a is ok')
    deepEqual(model2.toJSON(), {b: 2}, 'before b is ok')
    deepEqual(model3.toJSON(), {c: 3}, 'before c is ok')

    model1.set('a', 2)
    cycle.run()

    deepEqual(model1.toJSON(), {a: 2}, 'after a is ok')
    deepEqual(model2.toJSON(), {b: 3}, 'after b is ok')
    deepEqual(model3.toJSON(), {c: 4}, 'after c is ok')
})

test('model1.a->model2.a->model1.a', function () {
    var model1 = new cyclic.Model({a: 1})
    var model2 = new cyclic.Model({a: 1})

    model1.on('change:a', function (value) {
        model2.set('a', value)
    })

    model2.on('change:a', function (value) {
        model1.set('a', value)
    })

    var cycle = new cyclic.Cycle()
    cycle
        .add(model1)
        .add(model2)

    model1.set('a', 2)
    cycle.run()

    equal(model1.get('a'), 2, 'model1>model2 a1 is correct')
    equal(model2.get('a'), 2, 'model1>model2 a2 is correct')

    model2.set('a', 2)
    cycle.run()

    equal(model1.get('a'), 2, 'model2>model1 a1 is correct')
    equal(model2.get('a'), 2, 'model2>model1 a2 is correct')
})
