(function () {
    var toArray = Array.prototype.slice
    var inputs = toArray.call(document.getElementsByTagName('input'))

    var cycle = new cyclic.Cycle()
    setInterval(cycle.run.bind(cycle), 10)

    // Main sync model, represents the common state.
    var mainModel = new cyclic.Model()
    cycle.add(mainModel)

    // Models representing each input.
    var models = inputs.map(function (input) {
        var model = new cyclic.Model({element: input})
        cycle.add(model)

        // Create model>dom binding.
        model.on('change:value', function (value) {
            input.value = value
        })

        // Create mainModel>model binding to get notified when main model changes.
        mainModel.on('change:value', function (value) {
            model.set('value', value)
        })

        return model
    })

    // Create dom>model binding with basic event delegation.
    window.addEventListener('keydown', function (e) {
        var element = e.target

        if (element.nodeName != 'INPUT') return

        setTimeout(function () {
            var value = element.value

            // Notify current model silently to avoid current element gets
            // .value assigned again.
            models.forEach(function (model) {
                if (model.get('element') === element) {
                    model.set('value', value, true)
                }
            })

            mainModel.set('value', value)
        })
    })

    // Set initial value
    mainModel.set('value', 'edit me!')
}())
