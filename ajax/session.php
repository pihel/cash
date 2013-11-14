<?
$short = true;
require_once("../lib/init.php");

session_start();//ini_get("session.gc_maxlifetime")
$lac = intval($_SESSION['last_activity']);
//$lac = 1;
if($lac == 0) { 
    echo 1;
    exit;
}
if( time() - $lac > $life_time ) {
    echo 0;
    session_unset();
    session_destroy();
    exit;
}
echo 1;