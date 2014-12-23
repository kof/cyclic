(function () {
    var toArray = Array.prototype.slice
    var inputs = toArray.call(document.getElementsByTagName('input'))

    var cycle = new cyclic.Cycle()
    setInterval(cycle.run.bind(cycle), 10)

    // Main sync model, represents the common model.
    var model = new cyclic.Model()
    cycle.add(model)

    // Models representing each input.
    var models = inputs.map(function (input) {
        var model = new cyclic.Model({element: input})
        // Create model>dom binding.
        model.on('change:value', function (value) {
            input.value = value
        })
        cycle.add(model)
        return model
    })

    // Create dom>model binding.
    window.addEventListener('keydown', function (e) {
        var element = e.target

        // Find the model responsible for the current element.
        var currModel = models.filter(function (model) {
            return model.get('element') === element
        })[0]

        setTimeout(function () {
            var value = element.value
            // Notify current model silently to avoid current element gets
            // .value assigned again.
            currModel.set('value', value, true)
            model.set('value', value)
        })
    })

    // Notify state models if main model has changed.
    model.on('change:value', function (value) {
        models.forEach(function (model) {
            model.set('value', value)
        })
    })

    // Set initial value
    model.set('value', 'edit me!')
}())
