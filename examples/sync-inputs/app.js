(function () {
    var toArray = Array.prototype.slice
    var inputs = toArray.call(document.getElementsByTagName('input'))

    var mainModel = {value: 'edit me!'}

    inputs.forEach(function (element) {
        var model = {}

        cyclic
            .bind(mainModel, 'value')
            .to(model, 'value', {
                changed: function (value) {
                    if (element.value != value) element.value = value
                }
            })
            .to(mainModel, 'value')

        // Create dom>model binding.
        element.addEventListener('keydown', function (e) {
            setTimeout(function () {
                model.value = e.target.value
            })
        })
    })

    ;(function run() {
        cyclic.run()
        requestAnimationFrame(run)
    }())
}())
