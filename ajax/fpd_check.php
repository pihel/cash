<?php
require_once("../lib/init.php");
//require_once("../lib/functions.php");

if(empty($settings['fpd'])) exit;

$fpd = trim($_GET['fpd']);
if(!is_numeric($fpd)) exit;

echo file_get_contents($settings['fpd']."?type=".$_GET['type']."&fp=".$fpd);