<?php
function getTpl($tpl) {
  $tpl = "tpl/".$tpl.".php";
  $ret = null;
  if(file_exists($tpl)) {
      ob_start();
      $t = func_get_args();
      extract($t);
      require_once(realpath($tpl));
      $ret = ob_get_contents();
      ob_clean();
  } else return;
  return $ret;
}
?>