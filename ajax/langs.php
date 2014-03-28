<?
require_once("../lib/init.php");
$lngs = array();
foreach($lng->lst() as $k=>$l) {
  $lngs[] = array("id"=>$k, "name"=>$l);
}
echo json_encode( $lngs );