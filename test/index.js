test('closed cycle', function () {
    var model1 = new cyclic.Model({a: 1})
    var model2 = new cyclic.Model({b: 2})
    var model3 = new cyclic.Model({c: 3})

    model1.on('a', function (value) {
        model2.set('b', value + 1)
    })

    model2.on('b', function (value) {
        model3.set('c', value + 1)
    })

    model3.on('c', function (value) {
        model1.set('a', 2)
    })

    var cycle = new cyclic.Cycle()
    cycle
        .add(model1)
        .add(model2)
        .add(model3)

    model1.set('a', 2)
    cycle.run()

    deepEqual(model1.object, {a: 2}, 'a is ok')
    deepEqual(model2.object, {b: 3}, 'b is ok')
    deepEqual(model3.object, {c: 4}, 'c is ok')
})

test('bidirectional binding', function () {
    var model1 = new cyclic.Model({a: 1})
    var model2 = new cyclic.Model({a: 1})

    model1.on('a', function (value) {
        model2.set('a', value)
    })

    model2.on('a', function (value) {
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
