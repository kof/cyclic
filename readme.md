## Cyclic

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kof/cyclic?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Cyclic is an api for creating single or bidirectional bindings between any kind of objects. It schedules the changes
during one cycle to avoid cyclic dependencies and multi change overhead.

Take a look at [examples](http://kof.github.io/cyclic/examples/index.html) directory.

## Two way data binding example.

```javascript
// Global setup.
(function run() {
    cyclic.run()
    requestAnimationFrame(run)
}())

// 2 random objects.
var object1 = {a: 1}
var object2 = {a: 1}

// Create the binding.
cyclic.bind(object1, 'a').to(object2, 'a').to(object1, 'a')

object1.a = 2

// Both models are in sync.
object1.a // 2
object2.a // 2
```

## API

### Access the lib.

```javascript
// Commonjs
var cyclic = require('cyclic')

// Globals
var cyclic = window.cyclic
```

### Run.

You need to start the loop once manually. You can choose between running it within requestAnimationFrame (recommended) or using different technics.

```javascript
(function run() {
    cyclic.run()
    requestAnimationFrame(run)
}())
```

### Create binding.

`cyclic.bind(object, property)`

In the most cases you don't need to use `Model` or `Cycle` classes directly. They are used by a higher level abstraction - `Binding`, `cyclic.bind` returns `Binding` instance.

### Bind to.

`Binding#to(object, property, [options])`

Pass the object/property you want to bind to.

Options:
  - `transform` returned value will be applied, gets a value as a param
  - `changed` callback with new value (after transformation) as a param

[See example](./examples/transform/app.js)

### Model class.

`new cyclic.Model([object])`

In order to create a data binding we need to wrap a plain object into the model.
I intentionally avoid `Object.observe` and its shims because of performance issues, as I want to be able to create thousands of bindings.

```javascript
var model = new cyclic.Model({myAttr: 123})
```

### Get attribute value.

`model.get(name)`

```javascript
model.get('myAttr') // current value
```

### Set attribute value.

`model.set(name, value, [silent])`

Schedule attribute value change. Value is applied when `.apply` method is called. This allows us to avoid cyclic dependencies.

If `silent` is `true` the model gets modified without to schedule the change or trigger events.

```javascript
model.set('myAttr', 123)
```

### Get the object backed by model.

`model.toJSON()`

```javascript
model.toJSON() // {myAttr: 123}
```

### Listen to "change:{name}" events.

Model inherits from [Emitter](https://github.com/component/emitter). You can call all methods defined there. Event name is "change:" plus property name.

```javascript
model.on('change:myAttr', function (value, model) {
    console.log(value) // new value
})
```
### Cycle class.

`new cyclic.Cycle()`

```javascript
var cycle = new cyclic.Cycle()
```

### Add a model.

`cycle.add(model)`

Add a model to the cycle to let it apply changes when `.run()` is called.

### Run the cycle.

`cycle.run()`

Will apply changes on all models. You might want to call it in animation frame.

## License

MIT
