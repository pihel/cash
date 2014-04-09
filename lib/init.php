<?
error_reporting(0);

/* Root dir */
$root = __DIR__."/../";

/* Debug mode */
$debug = 0;

/* Path to sqlite database */
$sqlite_path = $root."data/cash.db3";

/* Time without actions */
$life_time = ini_get("session.gc_maxlifetime");

/* Demo stand (deny settings, file upload)*/
$demo = 0;

/* App version */
$version = "b=1.025";
//$version = rand(); //for reset cache

/* Path to imgs and js */
$static = "static";

if($debug) {
  error_reporting(~E_NOTICE);
}

require_once($root.'lib/error.php');
require_once($root.'lib/db/db.php');
require_once($root.'lib/db/sqlite.php');

$db = new SQLITE_DB($sqlite_path);
$db->connect();

if((bool)$short) return;

require_once($root.'lib/lang.php');
$lng = new Lang();
$lng->set($_COOKIE['LANG']);

require_once($root.'lib/user.php');
require_once($root.'lib/cash.php');

if($debug) {
  $db->debug = true;
}

$usr = new User($db, $lng);
$usr->auth();


$ch = new Cash($db, $usr, $lng);
$settings = $ch->getSettings();
$settings['version'] = $version;
$settings['demo'] = $demo;
$settings['debug'] = $debug;
$settings['static'] = $static;