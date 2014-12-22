(function () {
    var inputs = document.getElementsByTagName('input')

    function bindDom(input, mainModel) {
        // Represents the state of an input.
        var model = new cyclic.Model()

        // Create model>dom binding.
        model.on('change:value', function (value) {
            input.value = value
            mainModel.set('value', value)
        })
        // Create dom>model binding.
        input.addEventListener('keydown', function () {
            setTimeout(function () {
                model.set('value', input.value)
            })
        })

        // Create mainModel>model binding.
        mainModel.on('change:value', function (value) {
            model.set('value', value)
        })

        return model
    }

    var mainModel = new cyclic.Model()

    var model0 = bindDom(inputs[0], mainModel)
    var model1 = bindDom(inputs[1], mainModel)
    var model2 = bindDom(inputs[2], mainModel)

    // Set initial value
    mainModel.set('value', 'edit me!')

    var cycle = new cyclic.Cycle()
    cycle.add(mainModel).add(model0).add(model1).add(model2)

    setInterval(cycle.run.bind(cycle), 10)
}())
