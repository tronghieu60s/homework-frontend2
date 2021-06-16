function loadPostModal(e) {
  const nextElement = e.target.nextElementSibling;
  for (let i = 0; i < nextElement.childNodes.length; i++) {
    if (nextElement.childNodes[i].className == "card-title") {
      postModelTitle.innerText = nextElement.childNodes[i].innerText;
    }
  }
  // show modal
  const myModal = new bootstrap.Modal(postModelId);
  myModal.show();
}

const images = document.querySelectorAll(".card-img-top");
images.forEach((image) => {
  image.addEventListener("click", loadPostModal);
});
