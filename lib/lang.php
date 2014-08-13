<?php
abstract class iLang {
  //public $start_week;
  public $translate;
  public $currency;
}

class Lang {
  private $data;
  private $list;
  public $slang = "ru";
  
  public function __construct() {
    $this->list = $this->lst();
  }
  
  public function getCurrencys() {
    return $this->data->currency;
  }
  
  public function set($_slang) {
    if(!empty($_slang)) {
      $this->slang = $_slang;
    }
    $this->slang = $this->current();
    global $root;
    require_once($root.'lang/'.$this->slang.'.php');
    $cl_name = "Lang".$this->slang;
    $this->data = new $cl_name;
  }
  
  public function get($id, $param = array() ) {
    if(empty($id)) return $this->data->translate;
    global $debug;
    if($debug || !array_key_exists($id, $this->data->translate) ) {
      return $id;
    }
    $l = $this->data->translate[$id];
    foreach($param as $k=>$v) {
      $l = str_replace("{".$k."}", $v, $l);
    }
    
    return $l;
  }//get
  
  public function lst() {
    global $root;
    $lngs = glob($root."lang/*.php");
    foreach($lngs as $k=>$l) {
      $lngs[$k] = basename($l, ".php");
      if( $this->slang == $lngs[$k]) { //default lang - first
        $t = $lngs[0];
        $lngs[0] = $lngs[$k];
        $lngs[$k] = $t;
      }
    }
    return $lngs;
  }//lst
  
  public function current() {
    if(in_array($this->slang, $this->list ) ) {
      return $this->slang;
    } 
    return $this->detect($lst);
  } //current
  
  /*
    http://ru2.php.net/function.http-negotiate-language#86787
    
    determine which language out of an available set the user prefers most
   
    $available_languages        array with language-tag-strings (must be lowercase) that are available
    $http_accept_language    a HTTP_ACCEPT_LANGUAGE string (read from $_SERVER['HTTP_ACCEPT_LANGUAGE'] if left out)
  */
  protected function detect($available_languages,$http_accept_language="auto") {
    // if $http_accept_language was left out, read it from the HTTP-Header
    if ($http_accept_language == "auto") $http_accept_language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '';

    // standard  for HTTP_ACCEPT_LANGUAGE is defined under
    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4
    // pattern to find is therefore something like this:
    //    1#( language-range [ ";" "q" "=" qvalue ] )
    // where:
    //    language-range  = ( ( 1*8ALPHA *( "-" 1*8ALPHA ) ) | "*" )
    //    qvalue         = ( "0" [ "." 0*3DIGIT ] )
    //            | ( "1" [ "." 0*3("0") ] )
    preg_match_all("/([[:alpha:]]{1,8})(-([[:alpha:]|-]{1,8}))?" .
                   "(\s*;\s*q\s*=\s*(1\.0{0,3}|0\.\d{0,3}))?\s*(,|$)/i",
                   $http_accept_language, $hits, PREG_SET_ORDER);

    // default language (in case of no hits) is the first in the array
    $bestlang = $available_languages[0];
    $bestqval = 0;

    foreach ($hits as $arr) {
        // read data from the array of this hit
        $langprefix = strtolower ($arr[1]);
        if (!empty($arr[3])) {
            $langrange = strtolower ($arr[3]);
            $language = $langprefix . "-" . $langrange;
        }
        else $language = $langprefix;
        $qvalue = 1.0;
        if (!empty($arr[5])) $qvalue = floatval($arr[5]);
     
        // find q-maximal language 
        if (in_array($language,$available_languages) && ($qvalue > $bestqval)) {
            $bestlang = $language;
            $bestqval = $qvalue;
        }
        // if no direct hit, try the prefix only but decrease q-value by 10% (as http_negotiate_language does)
        else if (in_array($langprefix,$available_languages) && (($qvalue*0.9) > $bestqval)) {
            $bestlang = $langprefix;
            $bestqval = $qvalue*0.9;
        }
    }
    return $bestlang;
  } //detect
} //Lang