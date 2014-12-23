(function () {
    var toArray = Array.prototype.slice
    var inputs = toArray.call(document.getElementsByTagName('input'))

    var cycle = new cyclic.Cycle()
    setInterval(cycle.run.bind(cycle), 10)

    // Main sync model, represents the common state.
    var mainModel = new cyclic.Model()
    cycle.add(mainModel)

    function bind(element) {
        var model = new cyclic.Model({element: element})

        cycle.add(model)

        // Create model>dom binding.
        model.on('change:value', function (value) {
            if (element.value != value) element.value = value
        })

        // Create dom>model binding.
        element.addEventListener('keydown', function (e) {
            setTimeout(function () {
                model.set('value', e.target.value)
            })
        })

        // Create mainModel>model binding to get notified when main model changes.
        mainModel.on('change:value', function (value) {
            model.set('value', value)
        })

        // Create model>mainModel binding
        model.on('change:value', function (value) {
            mainModel.set('value', value)
        })
    }

    inputs.forEach(bind)

    // Set initial value
    mainModel.set('value', 'edit me!')
}())
