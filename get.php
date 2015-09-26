<?
require_once('lib/init.php');

$file = "";
$id = intval($_GET['id']);
if(empty($id)) exit;

$file = $ch->getFile($id);
if(empty($file)) exit;

$name = pathinfo($file, PATHINFO_BASENAME);

if (file_exists($file)) {
 if (ob_get_level()) {
   ob_end_clean();
 }
 $ctype = mime_content_type($file);
 if (empty($ctype)) {
  $ctype = "application/octet-stream";
 }
 header('Content-Description: File Transfer');
 header('Content-Type: ' . $ctype);
 header('Content-Disposition: inline; filename=' . $name);
 header('Content-Transfer-Encoding: binary');
 header('Expires: 0');
 header('Cache-Control: must-revalidate');
 header('Pragma: public');
 header('Content-Length: ' . filesize($file));
 readfile($file);
 exit;
}