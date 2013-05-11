<?
/*
2. Всегда видеть итоговую строку
3. Фильтры
5, подстановка параметров при выборе номенклатуры
6. время добаления - 4ч
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
