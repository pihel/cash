<?
/*
2. Всегда видеть итоговую строку ???? не понятно как
3. загрузка - отображение? +удаление файлов
5. анализ в разрезе пользователей бд
6. время в датах?
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
