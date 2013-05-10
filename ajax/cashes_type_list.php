<?
require_once("../lib/init.php");
echo json_encode( $ch->cashes_type_list() );
?>
