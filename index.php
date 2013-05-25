<?
/*
2. Всегда видеть итоговую строку ???? не понятно как
4. проверка прав на клиенте (передача с сервера)
загрузка файла? и отображение?
5. анализ в разрезе пользователей бд
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
