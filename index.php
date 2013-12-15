<?
/*
1. Всегда видеть итоговую строку ???? не понятно как
2. формат для денежных полей (право, разделители)
3. текст в прелоадерах (убрать стандартный)
4. фильтр по пользователю в отчетах (все или конкретный) и в планировании
5. финансовые цели в планировании
6. сделать API
7. распознавание чеков
9. мультиязычность
10 экспорт/импорт к xlsx, pdf
11. загрузка данных из инет банков
12. ежемесячные повторяющией расходы (доходы)
доделать округление в аналитике
*/
require_once('lib/init.php');
?>
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title><?=$settings['site_name'];?></title>
    <link rel="shortcut icon" href="<?=$settings['static'];?>/favicon.png" />
    <link href="<?=$settings['static'];?>/style.css" media="all" rel="stylesheet" type="text/css" />
    <link href="<?=$settings['extjs'];?>/resources/css/ext-all.css" media="all" rel="stylesheet" type="text/css" />
    <link href="<?=$settings['extjs']?>/examples/ux/grid/css/GridFilters.css" rel="stylesheet" type="text/css" />
    <link href="<?=$settings['extjs']?>/examples/ux/grid/css/RangeMenu.css" rel="stylesheet" type="text/css" />
    <script src="<?=$settings['extjs'];?>/ext-all.js" 	type="text/javascript"></script>
    <script language="javascript">
      var ux_dir = '<?=$settings['extjs'];?>/examples/ux';
      var static_dir = '<?=$settings['static'];?>';
    </script>
    <script src="<?=$settings['static'];?>/js/script.js" charset="UTF-8" type="text/javascript"></script>
    <script src="<?=$settings['extjs'];?>/locale/ext-lang-<?=$settings['lang'];?>.js" charset="UTF-8" type="text/javascript"></script>
  </head>
  <body>
    <div id="logout"></div>
    <div id="main"></div>
    <?=$settings['add'];?>
  </body>
</html>