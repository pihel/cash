<?php
function convert_size_to_num($size) {
  //This function transforms the php.ini notation for numbers (like '2M') to an integer (2*1024*1024 in this case)
  $l = substr($size, -1);
  $ret = substr($size, 0, -1);
  switch(strtoupper($l)){
  case 'P':
    $ret *= 1024;
  case 'T':
    $ret *= 1024;
  case 'G':
    $ret *= 1024;
  case 'M':
    $ret *= 1024;
  case 'K':
    $ret *= 1024;
    break;
  }
  return $ret;
} //convert_size_to_num

function get_max_fileupload_size() {
  $max_upload_size = min(convert_size_to_num(ini_get('post_max_size')), convert_size_to_num(ini_get('upload_max_filesize')));

  return $max_upload_size;
} //get_max_fileupload_size

function months_between($d1, $d2) {
  $ts1 = strtotime($d1);
  $ts2 = strtotime($d2);

  $year1 = date('Y', $ts1);
  $year2 = date('Y', $ts2);

  $month1 = date('m', $ts1);
  $month2 = date('m', $ts2);
  
  $day_of_month1 = cal_days_in_month(CAL_GREGORIAN, $month1, $year1);
  $day_of_month2 = cal_days_in_month(CAL_GREGORIAN, $month2, $year2);
  
  $day1 = date('d', $ts1);
  $day2 = date('d', $ts2);
  
  if($day1 == 1) $day1 = 0;
  
  return (($year2 - $year1) * 12) + ($month2 - $month1) + ( $day2 / $day_of_month2 - $day1 / $day_of_month1 );
} //months_between

function csrf_protect() {
  session_start(); 
  
  $csrftoken = "";
  $uri = pathinfo(array_pop(explode("/", $_SERVER['REQUEST_URI'])), PATHINFO_FILENAME);
  
  if( in_array($uri, array("", "index", "pda", "demo")) )  {
    if( empty($_SESSION['csrftoken']) ) {
      $csrftoken = md5( $_SERVER['SERVER_NAME'].rand(1, 10000000).$_SERVER['HTTP_HOST'] ); 
      $_SESSION['csrftoken'] = $csrftoken; 
    } else {
      $csrftoken = $_SESSION['csrftoken'];
    }    
  } else {
    $csrftoken = $_SESSION['csrftoken'];
    global $debug;
    if( $debug == 0 && $_REQUEST['xcsrf'] != $csrftoken) $csrftoken = "";
  }
  
  session_write_close();
  
  return $csrftoken;
} //csrf_protect

function http_post($url, $post, $file) {
  if (!extension_loaded('curl')) {
    return false;
  }
  if(empty($url)) {
    return false;
  }
  if(!empty($file)) {
    $post['file'] = '@'.$file.';filename='. basename($file).';type=image/gif';
  }
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL,$url);
  curl_setopt($ch, CURLOPT_POST,1);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  $result = curl_exec ($ch);
  curl_close ($ch);
  
  return $result;
  
} //http_post

function load_check($file) {
  $ext_type = array('gif','jpg','jpe','jpeg','png', 'tif', 'tiff', 'bmp');
  
  $file['name'] = strtolower($file['name']);
  $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
  if(!in_array($ext, $ext_type)) {
    return false;
  }
  
  global $root;
  $dir = $root."files/ocr";

  $hash = crc32(time().$file['name']);
  $hash = intval($hash);
  
  if( !file_exists( $dir ) ) {
    if( !mkdir( $dir, 0777, true) ) {
      return false;
    }
  }
  $fname = $dir.'/'.$hash.".".$ext;
  $fname_new = $dir.'/'.$hash.".gif";
  if(!move_uploaded_file($file['tmp_name'], $fname)) {
    return false;
  }
  
  if( !optimize_check($fname, $fname_new, 2048, 2048) ) {
    return false;
  }
  unlink($fname);
  
  global $lng, $version, $ocr_host, $settings;  
  $post = array("lang" => $lng->slang, "host" => $_SERVER['HTTP_HOST'], "version" => $version, "time" => time() );
  $hash = md5( $settings['ocr'].implode(',', $post).$settings['ocr'] );
  $post['hash'] = $hash;
  
  $fname_new = realpath($fname_new);  
  $ret = http_post($ocr_host, $post, $fname_new );
  
  if( !empty($ret) ) {
    unlink($fname_new);
  }
  
  return $ret;
} //load_check

//http://php5.ru/articles/image#size
function optimize_check($src, $dest, $width, $height, $rgb=0xFFFFFF) {
  if (!extension_loaded('gd')) {
    return false;
  }

  if (!file_exists($src)) return false;

  $size = getimagesize($src);

  if ($size === false) return false;

  $format = strtolower(substr($size['mime'], strpos($size['mime'], '/')+1));
  $icfunc = "imagecreatefrom" . $format;
  if (!function_exists($icfunc)) return false;

  $x_ratio = $width / $size[0];
  $y_ratio = $height / $size[1];

  $ratio       = min($x_ratio, $y_ratio);
  $use_x_ratio = ($x_ratio == $ratio);

  $new_width   = $use_x_ratio  ? $width  : floor($size[0] * $ratio);
  $new_height  = !$use_x_ratio ? $height : floor($size[1] * $ratio);
  $new_left    = 0; //$use_x_ratio  ? 0 : floor(($width - $new_width) / 2);
  $new_top     = 0; //!$use_x_ratio ? 0 : floor(($height - $new_height) / 2);

  $isrc = $icfunc($src);
  $idest = imagecreatetruecolor($new_width, $new_height);

  imagefill($idest, 0, 0, $rgb);
  imagecopyresampled($idest, $isrc, $new_left, $new_top, 0, 0, 
    $new_width, $new_height, $size[0], $size[1]);
  
  //gray scale
  if (function_exists('imagefilter'))  {
    imagefilter($idest, IMG_FILTER_GRAYSCALE);
  }

  imagegif($idest, $dest);

  imagedestroy($isrc);
  imagedestroy($idest);

  return true;
} //optimize_check