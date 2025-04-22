document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const sendBtn = document.getElementById("send-btn");

  test();

  sendBtn.addEventListener("click", () => {
    const name = nameInput.value;
    const email = emailInput.value;
    if (!name || !email) {
      alert("Заполни поля:)");
      return;
    }
    console.log(name, email);
    nameInput.value = "";
    emailInput.value = "";
    alert(`Саксес!\nName: ${name}\nEmail: ${email}\n`);
  });
});
