<?
/*
1. Всегда видеть итоговую строку ???? не понятно как
3. формат для денежных полей (право, разделители)
4. текст в прелоадерах
7. фильтр по пользователю в отчетах (все или конкретный) и в планировании
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
