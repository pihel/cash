<?
function recursive_iconv($in_charset, $out_charset, $arr){
    if (!is_array($arr)){
        return iconv($in_charset, $out_charset, $arr);
    }
    $ret = $arr;
    function array_iconv(&$val, $key, $userdata){
        $val = iconv($userdata[0], $userdata[1], $val);
    }
    array_walk_recursive($ret, "array_iconv", array($in_charset, $out_charset));
    return $ret;
}

function loadPage($url, $proxy = true) {
  //отдельный поток, не весит сервант

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_TIMEOUT, 3); //виснет сервак, при обработки ио запросов

  if($proxy) {
    curl_setopt($ch, CURLOPT_PROXY, "srvisa2");
    curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
    //curl_setopt($ch, CURLOPT_PROXYUSERPWD, "skan:Ra1qkj_11");
    //curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, 0);
  }

  //curl_setopt($ch, CURLOPT_FAILONERROR, 1);
  //curl_setopt($ch, CURLOPT_HEADER, 1);
  //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
  //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

  $html = curl_exec($ch);
  curl_close($ch);

  return $html;
}

function format_bytes($size) {
  $units = array(' Байт', ' КБайт', ' МБайт', ' ГБайт', ' ТБайт');
  for ($i = 0; $size >= 1024 && $i < 4; $i++) $size /= 1024;
  return round($size, 2).$units[$i];
}
?>