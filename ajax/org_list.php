<?
require_once("../lib/init.php");
echo json_encode( $ch->org_list($_GET['query'], $_GET['edit_id']) );
?>
