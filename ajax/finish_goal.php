<?
require_once("../lib/init.php");
require_once("../lib/goal.php");

$goal = new Goal($db, $usr, $lng);
echo  $goal->finishGoal($_GET['id']);
