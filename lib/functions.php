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
  $uri = basename( $_SERVER['REQUEST_URI'] );  
  if( in_array($uri, array("", "index.php", "pda.php")) )  {
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