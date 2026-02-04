const form = document.querySelector("updateFrom");
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
})