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

test('model.a->model.b->model.a', function () {
    var model = new cyclic.Model()

    model.on('change:a', function (value) {
        model.set('b', value)
    })

    model.on('change:b', function (value) {
        model.set('a', value)
    })

    var cycle = new cyclic.Cycle()
    cycle.add(model)

    equal(model.get('a'), undefined, 'default value is correct')
    equal(model.get('b'), undefined, 'default value is correct')

    model.set('a', 1)
    cycle.run()
    cycle.run()

    equal(model.get('a'), 1, 'model.a>model.b a is correct')
    equal(model.get('b'), 1, 'model.a>model.b b is correct')

    model.set('b', 2)
    cycle.run()
    cycle.run()

    equal(model.get('a'), 2, 'model.b>model.a a is correct')
    equal(model.get('b'), 2, 'model.b>model.a b is correct')
})
