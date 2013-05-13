<?
/*
2. Всегда видеть итоговую строку
3. Фильтры
4. проверка прав на клиенте (передача с сервера)
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
