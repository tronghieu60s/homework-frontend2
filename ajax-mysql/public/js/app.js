const urlAllProducts = "ajax/getAllProducts.php";
const urlProductById = "ajax/getProductById.php";
const urlProductsByCategory = "ajax/getProductsByCategory.php";
const urlProductsByPage = "ajax/getProductsByPage.php";

const allProducts = [];
(async () => {
  const products = await ajaxRequest(urlAllProducts);
  allProducts.push([...products]);
})();

function wait(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

function ajaxRequest(url, data) {
  return fetch(url, { method: "POST", body: JSON.stringify(data) }).then(
    (res) => res.json()
  );
}

function renderData(products) {
  // render list
  let renderList = "";
  for (let i = 0; i < products.length; i++) {
    const element = products[i];
    const pathName = element.product_name.replace(/ /g, "-");
    const path = (pathName + "-" + element.id).toLowerCase();
    renderList += `
      <div class="col-md-4">
          <div class="card">
              <a href="product.php/${path}">
                  <img src="./public/images/${element.product_photo}" class="card-img-top" alt="${element.product_name}">
              </a>
              <div class="card-body">
                  <h5 class="card-title" onclick="loadProductModal(${element.id})">${element.product_name}</h5>
                  <p class="card-text">${element.product_price}</p>
              </div>
          </div>
      </div>`;
  }

  productList.innerHTML = "";
  productList.innerHTML = renderList;
}

function renderMoreData(products) {
  // render list
  let renderList = "";
  for (let i = 0; i < products.length; i++) {
    const element = products[i];
    const pathName = element.product_name.replace(/ /g, "-");
    const path = (pathName + "-" + element.id).toLowerCase();
    renderList += `
      <div class="col-md-4">
          <div class="card">
              <a href="product.php/${path}">
                  <img src="./public/images/${element.product_photo}" class="card-img-top" alt="${element.product_name}">
              </a>
              <div class="card-body">
                  <h5 class="card-title" onclick="loadProductModal(${element.id})">${element.product_name}</h5>
                  <p class="card-text">${element.product_price}</p>
              </div>
          </div>
      </div>`;
  }

  productList.innerHTML += renderList;
}

// --- LOAD PRODUCTS MODAL
async function loadProductModal(id) {
  const product = await ajaxRequest(urlProductById, { id });
  const { product_name, product_description } = product;
  productModelTitle.innerText = product_name;
  productModelBody.innerText = product_description;

  // show modal
  const myModal = new bootstrap.Modal(productModelId);
  myModal.show();
}

// --- LOAD PRODUCTS CHECKBOX
const chkBox = document.querySelectorAll(".category");
chkBox.forEach((item) => item.addEventListener("change", loadProductsCheckbox));

async function loadProductsCheckbox() {
  const arrCheck = [];
  chkBox.forEach((item) => item.checked && arrCheck.push(item.value));
  if (arrCheck.length === 0)
    chkBox.forEach((item) => arrCheck.push(item.value));

  // get products
  const arrProducts = [];
  for (let i = 0; i < arrCheck.length; i++) {
    const data = { id: arrCheck[i] };
    const products = await ajaxRequest(urlProductsByCategory, data);
    arrProducts.push(...products);
  }

  renderData(arrProducts);
}

// --- SEARCH
searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value.toLowerCase();
  let products = [];
  if (value.length > 0)
    products = allProducts[0].filter(
      (o) => o.product_name.toLowerCase().indexOf(value) !== -1
    );
  renderSearchList(products, value);
});

function renderSearchList(products, search) {
  let renderList = "";
  for (let i = 0; i < products.length; i++) {
    const element = products[i];
    const pathName = element.product_name.replace(/ /g, "-");
    const path = (pathName + "-" + element.id).toLowerCase();
    const name = element.product_name.replace(
      new RegExp(search, "gi"),
      `<b>${search}</b>`
    );
    renderList += `
    <a href="product.php/${path}" class="list-group-item list-group-item-action">
      ${name}
    </a>`;
  }

  searchList.innerHTML = "";
  searchList.innerHTML = renderList;
}

// --- Load More
let page = 1;
const perPage = 3;
// handle click button
btnLoading.addEventListener("click", async () => {
  page += 1;
  const products = await ajaxRequest(urlProductsByPage, { perPage, page });
  // get next page
  const productsNextPage = await ajaxRequest(urlProductsByPage, {
    perPage,
    page: page + 1,
  });

  // waiting a few minutes
  spnLoading.classList.remove("d-none");
  await wait(1000);
  spnLoading.classList.add("d-none");

  renderMoreData(products);
  // check next page exists products
  if (productsNextPage.length === 0) btnLoading.classList.add("d-none");
});
