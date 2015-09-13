<?
require_once('lib/init.php');

if(!function_exists('mime_content_type')) {
 if (extension_loaded('fileinfo')) {
  function mime_content_type($filename) {
   $finfo = new finfo(FILEINFO_MIME_TYPE);
   $ctype = $finfo->file($filename);
   return $ctype;
  }
 } else {
  function mime_content_type($filename) {
   return "application/octet-stream";
  }
 }
}

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
 $defctype = "application/octet-stream";
 $ctype = mime_content_type($file);
 if (!$ctype) {
  $ctype = $defctype;
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
