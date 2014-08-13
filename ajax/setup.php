<?
require_once('../lib/init.php');

$ret = array('success'=>false, 'msg'=> $lng->get(218) );

if( $upd->needSetup() ) {
  if(empty($_POST['password']))  $ret = array('success'=>false, 'msg'=> $lng->get(181) );  
  
  if( $upd->setup($_POST['password']) ) {
    $ret = array('success'=>true, 'msg'=> $lng->get(217));
  }  //setup
} else {
  $ret = array('success'=>true, 'msg'=> $lng->get(217));
} //needSetup
echo json_encode($ret);
?>
