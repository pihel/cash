<?
require_once("../lib/init.php");
echo json_encode( $ch->getItem( intval($_GET['nmcl_id']) ) );
?>

