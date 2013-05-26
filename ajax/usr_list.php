<?
require_once("../lib/init.php");
require_once("../lib/settings.php");

$ch_set = new CashSett($db, $usr);
echo json_encode( $ch_set->getUsrs( $_GET['DB_ID'] ) );
?>

