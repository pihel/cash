<?
require_once("../lib/init.php");
echo json_encode( $ch->getList($_GET['from'], $_GET['to']) );
?>
