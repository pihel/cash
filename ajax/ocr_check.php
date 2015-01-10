<?
require_once("../lib/init.php");
require_once("../lib/functions.php");

$ret = load_check($_FILES['cash_list_edit_btn_add_check-inputEl']);
if(empty($ret)) $ret = json_encode( array('failure'=>true, 'msg'=> $this->lng->get(198)) );

echo $ret;
?>