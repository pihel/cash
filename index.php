<?
/*
1. Всегда видеть итоговую строку ???? не понятно как
2. анализ в разрезе пользователей бд
3. формат для денежных полей (право, разделители)
*/

try {
  require_once('lib/init.php');
  echo getTpl("index", $site_name);
}
catch(Error $e) {
  $err = getTpl("error", $e->message);
  echo getTpl("index", $err, "Ошибка");
}
?>
