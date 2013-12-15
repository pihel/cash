<?
require_once("../lib/init.php");
echo json_encode( $ch->getSettings_flat() );
?>
