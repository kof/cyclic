## Cyclic

This component provides low level api to create a single or bidirectional pure object based data binding and avoid cyclic dependencies.

```javascript

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

```
