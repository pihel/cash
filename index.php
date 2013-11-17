<?
/*
1. Всегда видеть итоговую строку ???? не понятно как
3. формат для денежных полей (право, разделители)
4. текст в прелоадерах
5. сохранять имя пользователя последнего входа и бд
7. фильтр по пользователю в отчетах (все или конкретный) и в планировании
*/
require_once('lib/init.php');
?>
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title><?=$site_name;?></title>
    <link href="static/style.css" media="all" rel="stylesheet" type="text/css" />
    <link href="static/ext/resources/css/ext-all.css" media="all" rel="stylesheet" type="text/css" />
    <link href="static/ext/ux/grid/css/GridFilters.css" rel="stylesheet" type="text/css" />
    <link href="static/ext/ux/grid/css/RangeMenu.css" rel="stylesheet" type="text/css" />
    <script src="static/ext/ext-all.js" 	type="text/javascript"></script>
    <script src="static/ext/ext-lang-ru.js" 	type="text/javascript"></script>
    <script src="static/user/script.js" charset="UTF-8"	type="text/javascript"></script>

    <link rel="shortcut icon" href="static/favicon.png" />
  </head>
  <body>
    <div id="logout"></div>
    <div id="main"></div>
    <?=$add;?>
  </body>
</html>