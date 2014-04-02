<?
require_once("../../lib/init.php");
require_once("../../lib/settings.php");

$ch_set = new CashSett($db, $usr, $lng);
$names = $ch_set->getUsrNames( $usr->db_id );
array_unshift(&$names, array('id' => -1, 'name' => $lng->get(202) ));
echo json_encode( $names );
?>

