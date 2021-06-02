<?php
require_once '../config/database.php';
require_once '../config/config.php';
spl_autoload_register(function ($class_name) {
    require '../app/models/' . $class_name . '.php';
});

$productModel = new ProductModel();
$item = $productModel->getProducts();

echo json_encode($item);
