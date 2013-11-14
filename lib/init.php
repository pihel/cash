<?
error_reporting(0);

$debug = $_GET['debug'] == 'Y' || strpos($_SERVER['HTTP_REFERER'], "debug=Y") !== false;

if($debug) {
  error_reporting(~E_NOTICE);
}

require_once('config.php');
require_once('error.php');
require_once('db/db.php');
require_once('db/sqlite.php');

$db = new SQLITE_DB("SQLITE", $sqlite_path, NULL, NULL, NULL);
$db->connect();

if((bool)$short) return;

require_once('user.php');
require_once('template.php');
require_once('cash.php');

if($debug) {
  $db->debug = true;
}

$usr = new User($db);
$usr->auth();


$ch = new Cash($db, $usr);