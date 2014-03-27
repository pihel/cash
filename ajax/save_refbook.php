<?
require_once("../lib/init.php");
require_once("../lib/settings.php");
$cset = new CashSett($db, $usr, $lng);
echo $cset->setSetting($_GET['refb'], $_GET['indx'], $_POST);
?>