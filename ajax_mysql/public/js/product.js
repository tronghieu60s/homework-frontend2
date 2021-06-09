function ajaxRequest(url, data) {
  return fetch(url, { method: "POST", body: JSON.stringify(data) }).then(
    (res) => res.json()
  );
}

const stars = document.querySelectorAll(".fa-star-size");
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    commentRating.value = index + 1;
    for (let i = 0; i <= 4; i++) {
      if (i <= index) stars[i].style.color = "#fb6340";
      else stars[i].style.color = "black";
    }
  });
});

const urlCreateComment = "/ajax_mysql/ajax/createComment.php";
const urlCommentsByIdProduct = "/ajax_mysql/ajax/getCommentsByProductId.php";
const urlLikeProduct = "/ajax_mysql/ajax/likeProductById.php";

(async () => {
  const id = productId.innerText;
  const comments = await ajaxRequest(urlCommentsByIdProduct, { id });
  onRenderComments(comments);
})();

// --- SUBMIT FORM
formSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (commentRating.value <= 0 || commentRating.value > 5) {
    alert("Vui lòng thêm số sao đánh giá chính xác.");
    return;
  }

  const comments = await ajaxRequest(urlCreateComment, {
    comment_author: commentAuthor.value,
    comment_rating: commentRating.value,
    comment_content: commentContent.value,
    product_id: productId.innerText,
  });
  if (comments) onRenderComments(comments);

  commentAuthor.value = "";
  commentContent.value = "";
});

function onRenderComments(comments) {
  let renderComments = "";

  if (comments.length === 0) {
    renderComments = "<h3>Chưa có đánh giá nào.</h3>";
  }

  comments.forEach((comment) => {
    let renderStar = "";
    for (let i = 0; i < comment["comment_rating"]; i++) {
      renderStar += `<i class="fa fa-star fa-star-color" aria-hidden="true"></i>`;
    }
    for (let i = 0; i < 5 - comment["comment_rating"]; i++) {
      renderStar += `<i class="fa fa-star-o fa-star-color" aria-hidden="true"></i>`;
    }

    renderComments += `
    <div class="d-flex">
        <div style="width: 10%;">
            <img class="w-100" src="/ajax_mysql/public/images/kaonashi.jpg" alt="">
        </div>
        <div class="ml-3" style="width: 90%;">
            <div>
              ${renderStar}
            </div>
            <b>${comment["comment_author"]}</b> <span>lúc ${comment["created_at"]}</span>
            <p class="mt-1">${comment["comment_content"]}</p>
        </div>
    </div>
    `;
  });
  renderListComments.innerHTML = renderComments;

  onRenderAverageStar(comments);
}

function onRenderAverageStar(comments) {
  let totalStar = 0;
  comments.forEach((comment) => {
    totalStar += comment["comment_rating"];
  });
  const averageStars = Math.ceil(totalStar / comments.length);

  let renderStar = "";
  for (let i = 0; i < averageStars; i++) {
    renderStar += `<i class="fa fa-star fa-star-color" aria-hidden="true"></i>`;
  }

  for (let i = 0; i < 5 - Math.ceil(averageStars); i++) {
    renderStar += `<i class="fa fa-star-o fa-star-color" aria-hidden="true"></i>`;
  }

  renderAverageStar.innerHTML = renderStar + ` - ${averageStars}/5 sao`;
}

function loadProductLikeText() {
  const product_id = productId.innerText;
  const dataStorage = JSON.parse(localStorage.getItem(".like_products")) || {};
  productLikeText.innerText = dataStorage[product_id] ? "Unlike" : "Like";
}

loadProductLikeText();

btnLikeProduct.addEventListener("click", async () => {
  const product_id = productId.innerText;

  // get data storage
  const dataStorage = JSON.parse(localStorage.getItem(".like_products")) || {};
  if (dataStorage[product_id]) dataStorage[product_id] = false;
  else dataStorage[product_id] = true;

  // rating database
  const product = await ajaxRequest(urlLikeProduct, {
    product_id,
    like: dataStorage[product_id],
  });
  productLikeValue.innerText = product.product_likes;

  // set storage rating
  localStorage.setItem(".like_products", JSON.stringify(dataStorage));
  loadProductLikeText();
});
