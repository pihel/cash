<?
/*
Цели:
1. фильтр по пользователю в отчетах (все или конкретный) и в планировании
2. финансовые цели в планировании
3. сделать API
4. распознавание чеков
5. мультиязычность
6 экспорт/импорт к xlsx, pdf
7. загрузка данных из инет банков
8. ежемесячные повторяющией расходы (доходы)
9. отчет по сравнению периодов

Проблемы:
1. Всегда видеть итоговую строку ???? не понятно как
2. формат для денежных полей (право, разделители)
3. текст в прелоадерах (убрать стандартный)
13. проблема с подгрузкой скриптов в IE
14. сохранение настроек главного грида (баг - не сохранются настройки видимости, не сохраняется позиция actioncolumn)
*/
require_once('lib/init.php');
?>
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title><?=$settings['site_name'];?></title>
    <link rel="shortcut icon" href="<?=$settings['static'];?>/favicon.png" />
    <link href="<?=$settings['static'];?>/style.css?<?=$settings['version'];?>" media="all" rel="stylesheet" type="text/css" />
    <link href="<?=$settings['extjs'];?>/resources/css/ext-all.css" media="all" rel="stylesheet" type="text/css" />
    <link href="<?=$settings['extjs']?>/examples/ux/grid/css/GridFilters.css" rel="stylesheet" type="text/css" />
    <link href="<?=$settings['extjs']?>/examples/ux/grid/css/RangeMenu.css" rel="stylesheet" type="text/css" />
    <script src="<?=$settings['extjs'];?>/ext-all.js" 	type="text/javascript"></script>
    <script language="javascript">
      var settings = <?
        $s = $settings;
        unset($s['add']);
        echo json_encode($s);
      ?>;
    </script>
    <script src="<?=$settings['static'];?>/js/script.js?<?=$settings['version'];?>" charset="UTF-8" type="text/javascript"></script>
    <script src="<?=$settings['extjs'];?>/locale/ext-lang-<?=$settings['lang'];?>.js" charset="UTF-8" type="text/javascript"></script>
  </head>
  <body>
    <div id="logout"></div>
    <div id="main"></div>
    <?=$settings['add'];?>
  </body>
</html>