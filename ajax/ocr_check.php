<?
require_once("../lib/init.php");
require_once("../lib/functions.php");

$ret = trim( load_check($_FILES['cash_list_edit_btn_add_check-inputEl']) );
if(empty($ret) || strlen($ret) < 10 ) $ret = json_encode( array('failure'=>true, 'msg'=> $lng->get(198)) );

echo $ret;
?>