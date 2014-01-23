<?
require_once("../../lib/init.php");
require_once("../../lib/settings.php");

$ch_set = new CashSett($db, $usr);
$names = $ch_set->getUsrNames( $usr->db_id );
array_unshift(&$names, array('id' => -1, 'name' => 'Любой'));
echo json_encode( $names );
?>

