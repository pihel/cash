<?php
//require_once("../lib/init.php");
//require_once("../lib/functions.php");

$fpd = intval( $_GET['fpd'] );
if($fpd == 0) exit;

echo file_get_contents("http://skahin.ru/api/cash/?type=".$_GET['type']."&fp=".$fpd);//1659429296