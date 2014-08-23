<?php
require_once("en.php");
class LangUs extends LangEn {
  
  function __construct() {
    //swap currencys
    $cur = $this->currency;
    $this->currency = array( 1 => $cur[2], 2 => $cur[1] );
    $this->currency[2][1] = round( 1/$this->currency[1][1], 2);
    $this->currency[1][1] = 1;
  }
}
