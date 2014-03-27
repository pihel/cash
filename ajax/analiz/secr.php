<?
require_once("../../lib/init.php");
require_once("../../lib/analiz.php");

$ch_analiz = new CashAnaliz($db, $usr, $lng);
echo json_encode( $ch_analiz->getSecr($_GET['amount'], $_GET['in'], $_GET['out'], $_GET['proc_in'], $_GET['proc_out'], $_GET['usr']) );
?>

