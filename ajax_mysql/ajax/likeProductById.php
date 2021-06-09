<?php
require_once '../config/database.php';
require_once '../config/config.php';
spl_autoload_register(function ($class_name) {
    require '../app/models/' . $class_name . '.php';
});

$input = json_decode(file_get_contents('php://input'), true);
$product_id = $input['product_id'];
$like = $input['like'];

$productModel = new ProductModel();
$item = $productModel->updateLikeProductById($product_id, $like);

if ($item) {
    $products = $productModel->getProductById($product_id);
    echo json_encode($products);
}
