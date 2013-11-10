<?
/*
1. Всегда видеть итоговую строку ???? не понятно как
2. анализ в разрезе пользователей бд
3. формат для денежных полей (право, разделители)
4. текст в прелоадерах
5. в примечании дать возможность нажимать enter
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
