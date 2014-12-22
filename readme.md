## Cyclic

This component allows you to create a single or bidirectional data binding between any kind of objects and to avoid cyclic dependencies.

This api is low level and hence verbose. You might want to create a nice declarative lib using this api and so will I.

## Two way data binding example.

```javascript
var model1 = new cyclic.Model({a: 1})
var model2 = new cyclic.Model({a: 1})

// Bind value model1.a > model2.a
model1.on('change:a', function (value) {
    model2.set('a', value)
})

// Bind value model2.a > model1.a
model2.on('change:a', function (value) {
    model1.set('a', value)
})

// Create a cycle which will control the models
var cycle = new cyclic.Cycle()
cycle
    .add(model1)
    .add(model2)

// Set model1.a to 2
model1.set('a', 2)

// Run the cycle (you might want to do it within animation frame)
cycle.run()

// Both models are in sync.
model1.get('a') // 2
model2.get('a') // 2
```

## API

### Access the lib.

```javascript
// Commonjs
var cyclic = require('cyclic')

// Globals
var cyclic = window.cyclic
```

### Model class.

`cyclic.Model([object])`

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

`model.set(name, value)`

Schedule attribute value change. Value is applied once .apply method is called. This allows us to avoid cyclic dependencies.

```javascript
model.set('myAttr', 123)
```

### Get the object backed by model.

`model.toJSON()`

```javascript
model.toJSON() // {myAttr: 123}
```

### Listen to "change:{name}" events.

Model inherits from [Emitter](https://github.com/component/emitter). You can call all methods defined there. Event name is "change:" plus attributes name.

```javascript
model.on('change:myAttr', function (value) {
    console.log(value) // new value
})
```
### Cycle class.

`cyclic.Cycle()`

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
