<?
require_once("../lib/init.php");
require_once("../lib/settings.php");

$ch_set = new CashSett($db, $usr, $lng);
echo json_encode( $ch_set->getUsrNames( $_GET['DB_ID'] ) );
?>

