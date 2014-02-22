<?
require_once("../lib/init.php");
echo json_encode( $ch->nmcl_param( intval($_GET['nmcl_id']), $_GET['nmcl_name'] ) );
?>
