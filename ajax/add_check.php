<?
require_once("../lib/init.php");

$ret = "";
$ret = $ch->add_check($_POST);
echo json_encode( $ret );