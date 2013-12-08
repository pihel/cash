<?
/*
1. Всегда видеть итоговую строку ???? не понятно как
2. формат для денежных полей (право, разделители)
3. текст в прелоадерах (убрать стандартный)
4. фильтр по пользователю в отчетах (все или конкретный) и в планировании
5. финансовые цели в планировании
6. сделать API
7. распознавание чеков
*/
require_once('lib/init.php');
?>
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title><?=$site_name;?></title>
    <link href="static/style.css" media="all" rel="stylesheet" type="text/css" />
    <link href="ext/resources/css/ext-all.css" media="all" rel="stylesheet" type="text/css" />
    <link href="ext/ux/grid/css/GridFilters.css" rel="stylesheet" type="text/css" />
    <link href="ext/ux/grid/css/RangeMenu.css" rel="stylesheet" type="text/css" />
    <script src="ext/ext-all.js" 	type="text/javascript"></script>
    <script src="ext/ext-lang-ru.js" 	type="text/javascript"></script>
    <script src="static/user/script.js" charset="UTF-8"	type="text/javascript"></script>

    <link rel="shortcut icon" href="static/favicon.png" />
  </head>
  <body>
    <div id="logout"></div>
    <div id="main"></div>
    <?=$add;?>
  </body>
</html>