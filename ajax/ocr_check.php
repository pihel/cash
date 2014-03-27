<?
require_once("../lib/init.php");
require_once("../lib/ocr.php");

global $settings;
if($settings['demo'] == 1) { 
  echo json_encode( array('failure'=>true, 'msg'=> $lng->get(194) ) );
  exit;
}

$hlp = new OCR_Helper($lng);

$ret = array();
if( !empty($_GET['hash']) ) {
  $ret = $hlp->parse($_GET['hash'], $_GET['type']);
} else {
  $ret = $hlp->recognize($_FILES);
}
echo json_encode($ret);
?>