<?php
class CommentModel extends Db
{
    // Lấy tát cả sản phẩm
    public function getCommentsByIdProduct($id)
    {
        //2. Viết câu SQL
        $sql = parent::$connection->prepare("SELECT * FROM comments WHERE product_id = ?");
        $sql->bind_param('i', $id);
        return parent::select($sql);
    }

    public function createComment($comment_author, $comment_content, $comment_rating, $product_id)
    {
        $sql = parent::$connection->prepare("INSERT INTO `comments` (`comment_author`, `comment_content`, `comment_rating`, `product_id`) VALUES (?, ?, ?, ?);");
        $sql->bind_param('ssii',$comment_author, $comment_content, $comment_rating, $product_id);
        return $sql->execute();
    }
}
