export function handModal() {
  const openModal = document.getElementById("open-modal");
  const modalContainer = document.querySelector(".modal__controller--post");

  openModal.addEventListener("click", () => {
    modalContainer.showModal();
    closeModal();
  });
}
function closeModal() {
  const closeModalButton = document.querySelector("#closeModalButton");
  const cancelButton = document.querySelector(".cancelButton");
  const modalContainer = document.querySelector(".modal__controller--post");

  closeModalButton.addEventListener("click", (event) => {
    event.preventDefault();

    modalContainer.close();
  });

  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();

    modalContainer.close();
  });
}
