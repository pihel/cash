<?
require_once('lib/init.php');

$file = "";
$id = intval($_GET['id']);
if(empty($id)) exit;

$file = $ch->getFile($id);
if(empty($file)) exit;

$name = pathinfo($file, PATHINFO_BASENAME);
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

if (file_exists($file)) {
 if (ob_get_level()) {
   ob_end_clean();
 }
 switch ($ext) {
  case "jpg":
  case "jpeg":
   $ctype = "image/jpeg";
   break;
  case "png":
   $ctype = "image/png";
   break;
  case "gif":
   $ctype = "image/gif";
   break;
  case "pdf":
   $ctype = "application/pdf";
   break;
  default:
   $ctype = "application/octet-stream";
 }
 header('Content-Description: File Transfer');
 header('Content-Type: '.$ctype);
 header('Content-Transfer-Encoding: binary');
 header('Expires: 0');
 header('Cache-Control: must-revalidate');
 header('Pragma: public');
 header('Content-Length: ' . filesize($file));
 readfile($file);
 exit;
}
