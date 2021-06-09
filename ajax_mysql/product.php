<?php
session_start();
require_once './config/database.php';
require_once './config/config.php';
spl_autoload_register(function ($class_name) {
    require './app/models/' . $class_name . '.php';
});

$pathURI = explode('-', $_SERVER['REQUEST_URI']);
$id = $pathURI[count($pathURI) - 1];

//$id = $_GET['id'];
$productModel = new ProductModel();


//Tang view
if (isset($_SESSION["view"])) {

    //Kiem tra id da ton tai trong mang
    if (!in_array($id, $_SESSION["view"])) {
        $_SESSION["view"][] = $id;

        //Goi ham tang view
        $productModel->updateView($id);
    }
} else {
    $_SESSION["view"] = array();
    $_SESSION["view"][] = $id;

    //Goi ham tang view
    $productModel->updateView($id);
}

$item = $productModel->getProductById($id);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <?php
                $mainPhoto = explode(',', $item['product_photo']);
                ?>
                <img src="/<?php echo BASE_URL; ?>/public/images/<?php echo $mainPhoto[0]; ?>" class="img-fluid" alt="...">
                <?php
                foreach ($mainPhoto as $photo) {
                ?>
                    <img src="/<?php echo BASE_URL; ?>/public/images/<?php echo $photo; ?>" class="img-fluid" alt="..." style="width: 50px;">
                <?php
                }
                ?>
            </div>
            <div class="col-md-8">
                <p class="d-none" id="productId"><?php echo $id ?></p>
                <h1><?php echo $item['product_name'] ?></h1>
                <div class="mb-2" id="renderAverageStar"></div>
                <p><?php echo $item['product_price'] ?></p>
                <p>
                    <?php echo $item['product_description'] ?>
                </p>
                <p><?php echo $item['product_view'] ?></p>
                <button id="btnLikeProduct" type="button" class="btn btn-primary">
                    <i class="fa fa-thumbs-up" style="font-size: 20px;" aria-hidden="true"></i>
                    <span id="productLikeText">Like</span>
                    <span id="productLikeValue" class="badge badge-warning"><?php echo $item['product_likes'] ?></span>
                </button>
            </div>
        </div>
        <h3 class="mt-5">Bình Luận</h3>
        <div class="row py-5 mb-5">
            <style>
                .fa-star-color {
                    color: #fb6340;
                    margin: 0 1px;
                }

                .fa-star-size {
                    font-size: 23px;
                    cursor: pointer;
                }

                .fa-star-size:hover {
                    cursor: pointer;
                }
            </style>
            <div class="col-md-7 mb-5 mb-md-0">
                <div class="px-md-5" id="renderListComments">

                </div>
            </div>
            <div class="col-md-5">
                <form id="formSubmit">
                    <div class="mb-2">
                        <i class="fa fa-star fa-star-size" aria-hidden="true"></i>
                        <i class="fa fa-star fa-star-size" aria-hidden="true"></i>
                        <i class="fa fa-star fa-star-size" aria-hidden="true"></i>
                        <i class="fa fa-star fa-star-size" aria-hidden="true"></i>
                        <i class="fa fa-star fa-star-size" aria-hidden="true"></i>
                    </div>
                    <input id="commentRating" type="text" class="d-none">
                    <div class="form-group">
                        <label for="">Tên</label>
                        <input required id="commentAuthor" type="text" class="form-control w-50" placeholder="" aria-describedby="helpId">
                    </div>
                    <div class="form-group">
                        <label for="">Nội Dung</label>
                        <textarea required id="commentContent" class="form-control" name="" id="" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Đánh Giá</button>
                </form>
            </div>
        </div>
    </div>

    <script src="/<?php echo BASE_URL; ?>/public/js/product.js"></script>
</body>

</html>