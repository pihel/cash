<?
require_once("../lib/init.php");
echo json_encode( $ch->nmcl_list(trim($_GET['query']), $_GET['edit_id'], $_GET['limit']) );
