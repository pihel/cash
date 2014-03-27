<?
require_once("../../lib/init.php");
require_once("../../lib/analiz.php");

$ch_analiz = new CashAnaliz($db, $usr, $lng);
echo json_encode( $ch_analiz->getStorage($_GET['amount'], $_GET['usr']) );
?>

