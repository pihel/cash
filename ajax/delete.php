<?
require_once("../lib/init.php");
echo $ch->del(intval($_GET['id']));