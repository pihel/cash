<?
/*
2. Всегда видеть итоговую строку
4. проверка прав на клиенте (передача с сервера)
5. анкоры при фильтре и загрузке (загрузка на первой вкладке!)
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
