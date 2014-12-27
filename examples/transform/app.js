(function () {
    var input = document.getElementsByTagName('input')[0]

    var inputModel = {}
    function onInput() {
        inputModel.value = input.value
    }
    input.addEventListener('input', onInput)
    onInput()

    var outputModel1 = {}
    var outputElement1 = document.querySelectorAll('.output-1')[0]
    var outputModel2 = {}
    var outputElement2 = document.querySelectorAll('.output-2')[0]

    cyclic.bind(inputModel, 'value')
        .to(outputModel1, 'value', {
            changed: function (value) {
                outputElement1.textContent = value
            }
        })
        .to(outputModel2, 'value', {
            transform: function (value) {
                return value * 2
            },
            changed: function (value) {
                outputElement2.textContent = value
            }
        })

    ;(function run() {
        cyclic.run()
        requestAnimationFrame(run)
    }())
}())
