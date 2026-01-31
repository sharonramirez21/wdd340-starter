const passwordBtn = document.querySelector("#passwordBtn");
passwordBtn.addEventListener("click", () => {
    const pasInput = document.querySelector("#account_password");
    const type = pasInput.getAttribute("type");
    if (type == "password") {
        pasInput.setAttribute("type", "text");
        passwordBtn.innerHTML = "•••";
    } else {
        pasInput.setAttribute("type", "password");
        passwordBtn.innerHTML = "👁";
    }
}) 