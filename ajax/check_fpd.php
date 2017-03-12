<?
require_once("../lib/init.php");

$fpd = trim($_GET['fpd']);
if(!is_numeric($fpd)) exit;

echo json_encode( array('fpd' => $ch->checkFpd($fpd) ) );
?>
