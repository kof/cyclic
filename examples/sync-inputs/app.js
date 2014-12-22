(function () {
    var inputs = document.getElementsByTagName('input')

    function bindDom(input) {
        // Represents the state of input0
        var model = new cyclic.Model()

        // Create model>dom binding
        model.on('change:value', function (value) {
            if (input.value != value) input.value = value
        })
        // Create dom>model binding
        input.addEventListener('keydown', function () {
            setTimeout(function () {
                model.set('value', input.value)
            })
        })

        return model
    }

    // Create binding between models
    function bindModels(model0, model1) {
        model0.on('change:value', function (value) {
            model1.set('value', value)
        })
    }

    var model0 = bindDom(inputs[0])
    var model1 = bindDom(inputs[1])
    var model2 = bindDom(inputs[2])

    bindModels(model0, model1)
    bindModels(model1, model0)
    bindModels(model0, model2)
    bindModels(model2, model0)

    // Set initial value
    model0.set('value', 'edit me!')

    var cycle = new cyclic.Cycle()
    cycle.add(model0).add(model1).add(model2)

    setInterval(cycle.run.bind(cycle), 10)
}())
