<?
require_once("../lib/init.php");
require_once("../lib/ocr.php");

global $settings;
if($settings['demo'] == 1) { 
  echo json_encode( array('failure'=>true, 'msg'=> 'Извините, распознание чеков отключено в режиме демо стенда!') );
  exit;
}

$hlp = new OCR_Helper();

$ret = array();
if( !empty($_GET['hash']) ) {
  $ret = $hlp->parse($_GET['hash'], $_GET['type']);
} else {
  $ret = $hlp->recognize($_FILES);
}
echo json_encode($ret);
?>