'use strict'

test('property value remains the same after binding', function () {
    var obj = {value: 1}
    cyclic.bind(obj, 'value')
    cyclic.run()
    equal(obj.value, 1, 'value is valid')
})

test('initial value gets synced to the connected object', function () {
    var obj1 = {value: 1}
    var obj2 = {}
    cyclic.bind(obj1, 'value').to(obj2, 'value')
    cyclic.run()
    equal(obj1.value, 1, 'obj1.value is valid')
    equal(obj2.value, 1, 'obj2.value is valid')
})

test('changed callback', function () {
    var obj1 = {value: 1}
    var obj2 = {}
    var changed
    cyclic.bind(obj1, 'value').to(obj2, 'value', {
        changed: function (value) {
            changed = value
        }
    })
    obj1.value = 2
    cyclic.run()
    equal(changed, 2, 'changed callback worked')
})

test('transform fn', function () {
    var obj1 = {value: 1}
    var obj2 = {}
    var changed
    cyclic.bind(obj1, 'value').to(obj2, 'value', {
        transform: function (value) {
            return value + 1
        }
    })
    obj1.value = 2
    cyclic.run()
    equal(obj1.value, 2, 'obj1.value == 2')
    equal(obj2.value, 3, 'obj1.value == 3')
})

test('same object, different props', function () {
    var obj = {}
    cyclic.bind(obj, 'a').to(obj, 'b')
    equal(obj.a, undefined, 'initial value')
    equal(obj.b, undefined, 'initial value')
    cyclic.run()
    obj.a = 1
    cyclic.run()
    cyclic.run()
    equal(obj.a, 1, 'a is 1')
    equal(obj.b, 1, 'b is 1')
})

test('obj1.a->obj2.b change a', function () {
    var obj1 = {}
    var obj2 = {}

    cyclic.bind(obj1, 'a').to(obj2, 'b')

    cyclic.run()
    equal(obj1.a, undefined)
    equal(obj2.b, undefined)

    obj1.a = 1
    cyclic.run()
    equal(obj1.a, 1)
    equal(obj2.b, 1)
})

test('obj1.a->obj2.b->obj1.a', function () {
    var obj1 = {}
    var obj2 = {}

    cyclic.bind(obj1, 'a').to(obj2, 'b').to(obj1, 'a')

    cyclic.run()
    equal(obj1.a, undefined, 'obj1.a == undefined')
    equal(obj2.b, undefined, 'obj2.b == undefined')

    obj1.a = 1
    cyclic.run()
    equal(obj1.a, 1, 'obj1.a == 1')
    equal(obj2.b, 1, 'obj2.b == 1')

    obj2.b = 2
    cyclic.run()
    cyclic.run()
    equal(obj1.a, 2, 'obj1.a == 2')
    equal(obj2.b, 2, 'obj2.b == 2')
})
