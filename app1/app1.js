let count = 10

document.querySelector('#app1btn').addEventListener('click', function () {
    this.textContent = count++
})