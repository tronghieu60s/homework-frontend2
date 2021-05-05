<?php
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name']; 
echo "Xin chào $name";