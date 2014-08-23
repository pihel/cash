<?php
require_once("en.php");
class LangUs extends LangEn {  
  public $currency = array(
    //todo: развернуть массив без дублирования
    1 => array("Dollar", 1, "$", "dol."),
    2 => array("Euro", 1.33, "€", "eur.")
  );
}
