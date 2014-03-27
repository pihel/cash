<?
error_reporting(0);
$root = __DIR__."/../";

/* режим отладки */
$debug = 0;

/* Путь до файла базы данных */
$sqlite_path = $root."data/cash.db3";

/* Допустимое время бездействия */
$life_time = ini_get("session.gc_maxlifetime");

/* Демонстрационный стенд (запрет изменения настроек, смены прав, загрузка файлов)*/
$demo = 0;

/*Версия*/
$version = "b=1.022";
//$version = rand(); //для отладки

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
$lang = "ru";
require_once($root.'lang/'.$lang.'.php');
$lang_cl = "Lang".$lang;
$lng = new $lang_cl();

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