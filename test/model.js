'use strict'

QUnit.module('Model')

test('create a model', function () {
    var model = new cyclic.Model()
    equal(typeof model.id, 'number', 'id is generated')
    deepEqual(model.object, {}, 'object is set by default')
    equal(model.isDirty, false, 'is not dirty')
})

test('get property', function () {
    var model = new cyclic.Model({a: 1})
    equal(model.get('a'), 1, 'a is 1')
})

test('set new property value', function () {
    var model = new cyclic.Model()
    model.set('a', 1)
    deepEqual(model.object, {}, 'object is empty')
    equal(model.changed.a, 1, 'changed.a is 1')
    ok(model.isDirty, 'is dirty')
})

test('set existing property value', function () {
    var model = new cyclic.Model({a: 1})
    model.set('a', 1)
    deepEqual(model.object, {a: 1}, 'object is not modified')
    deepEqual(model.changed, {}, 'nothing has changed')
    ok(!model.isDirty, 'is not dirty')
})

test('set new property value silently', function () {
    var model = new cyclic.Model()
    model.set('a', 1, true)
    deepEqual(model.changed, {}, 'changed map is empty')
    equal(model.object.a, 1, 'object.a is 1')
    ok(!model.isDirty, 'is not dirty')
})

test('toJSON', function () {
    var object = {a: 1}
    var model = new cyclic.Model(object)
    strictEqual(model.object, object, 'returns same object')
    strictEqual(model.toJSON(), object, 'returns object')
})

test('apply changes', function () {
    var model = new cyclic.Model()
    model.set('a', 1)
    var eventArguments
    model.on('change:a', function () {
        eventArguments = Array.prototype.slice.call(arguments)
    })
    model.apply()
    deepEqual(eventArguments, [1, model], 'event emitted with right arguments')
    equal(model.get('a'), 1, 'a is set to 1')
    deepEqual(model.changed, {}, 'changed is empty')
    ok(!model.isDirty, 'model is not dirty')
})

