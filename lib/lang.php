<?php
abstract class Lang {
  public static $desc;  
  public $start_week;
  public $translate;
  
  public function get($id, $param = array() ) {
    if(empty($id)) return $this->translate;
    global $debug;
    if($debug || !array_key_exists($id, $this->translate) ) {
      return $id;
    }
    $l = $this->translate[$id];
    foreach($param as $k=>$v) {
      $l = str_replace("{".$k."}", $v, $l);
    }
    
    return $l;
  }//get
  
  public function list() {
    global $root;
    $lngs = glob($root."lang/*.php");
    foreach($lngs as $k=>$l) {
      $lngs[$k] = basename($l, ".php");
    }
    return $lngs;
  }
}