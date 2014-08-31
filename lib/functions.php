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
}

function get_max_fileupload_size() {
  $max_upload_size = min(convert_size_to_num(ini_get('post_max_size')), convert_size_to_num(ini_get('upload_max_filesize')));

  return $max_upload_size;
}
