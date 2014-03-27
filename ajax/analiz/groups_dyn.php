<?
require_once("../../lib/init.php");
require_once("../../lib/analiz.php");

$ch_analiz = new CashAnaliz($db, $usr, $lng);
//print_r($ch_analiz->getGroupsDyn($_GET['from'], $_GET['to'], $_GET['in']));
//exit;
echo json_encode( $ch_analiz->getGroupsDyn($_GET['from'], $_GET['to'], $_GET['gr'], $_GET['usr']) );

