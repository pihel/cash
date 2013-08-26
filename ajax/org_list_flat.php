<?
require_once("../lib/init.php");
echo json_encode( $ch->org_list_flat() );
?>
