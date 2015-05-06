<?
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
    <script src="http://maps.google.com/maps/api/js?sensor=false" type="text/javascript"></script>
    <script language="javascript">
      var settings = <? unset($settings['ocr']); echo json_encode($settings);?>;
      var translate = <?=json_encode($lng->get(null));?>;
    </script>
    <script src="<?=$settings['static'];?>/js/script.js?<?=$settings['version'];?>" charset="UTF-8" type="text/javascript"></script>
    <script src="<?=$settings['extjs'];?>/locale/ext-lang-<? if( $lng->slang == "us" ) echo "en"; else echo $lng->slang; ?>.js" charset="UTF-8" type="text/javascript"></script>
  </head>
  <body>
    <div id="logout"></div>
    <div id="main"></div>
    <?=$settings['add'];?>
  </body>
</html>