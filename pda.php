<?
require_once('lib/init.php');
$auth = array();
if(!empty($_POST['login_usr_name_list_cb'])) {
  $auth = $usr->auth($_POST);
  if($auth['success'] == 1) {
    header("Location: pda.php");
  }
}
?>
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title><?=$settings['site_name'];?> &mdash; Мобильная версия</title>
    <link rel="shortcut icon" href="<?=$settings['static'];?>/favicon.png" />
    <style type="text/css">
    * {
        font-family: Verdana, Arial, Helvetica, sans-serif;
        font-size: 14px;
    }
    body, html {
      margin: 0px;
      padding: 3px;
      height: 100%;
    }
    body {
      background-color: #DFE9F6;	
    }
    #add {
      margin-bottom: 10px;
    }
    #add input {
      width: 100%;
      height: 35px;
      cursor: pointer;
    }
    #filter {
      margin: 0px auto;
      text-align: center;
    }
    #filter input {
      border: 1px solid #A6C9F4;
      width: 150px;
      height: 30px;
      font-size: 15px;
    }
    h2 {
      margin: 0px;
      padding: 0px 0px 5px 0px;
      font-size: 15px;
      font-weight: bold;
    }
    ul {
      padding: 0px;
      margin: 0px;
      margin-top: 10px;
      border: 1px solid #A6C9F4;
      background: transparent url("<?=$settings['static'];?>/loading.gif") 50% 50% no-repeat;	
      min-height: 150px;
      width: 100%;
    }
    ul li {
      list-style: none outside none;
      vertical-align: top;
      padding: 10px 5px 10px 5px;
    }
    #list li:nth-child(odd) {
       background-color: #A6C9F4;
    }
    #list .date {
      font-size: 11px;
      top: -5px;
      position: relative;
      color: #333;
    }
    #list .amount {
      position: absolute;
      right: 15px;
      margin-top: -5px;
      font-weight: bold;
    }
    #list .org {
      font-size: 11px;
      color: #333;
    }
    #list .in {
      color: #2E5500;
    }
    #list .out {
      color: #9F002E;
    }
    #itog {
      font-weight: bold;
      text-align: right;
      padding: 5px;
    }
    #list .del {
      position: absolute;
      right: 15px;
      margin-top: 2px;
    }
    </style>
    <script language="javascript">
      var settings = <?=json_encode($settings);?>;
      
      function id(p_id) {
        return document.getElementById(p_id);
      } //id
      
      function ajax(url, _cb) {
        request = new XMLHttpRequest;
        request.open('GET', url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400){
            _cb(JSON.parse(request.responseText));            
          } 
        }

        request.send();
      } //ajax
      
      function getLineTpl(o) {
        var class_name = "out";
        if(o.amount > 0) {
          class_name = "in";
        }
        return '<li>\
          <span class="date">'+o.dt+'</span>\
          <span class="amount ' + class_name + '">' + price(o.amount) + o.sign + '</span>\
          <h2 class="name">' + o.nom + '</h2>\
          <span class="org">' + o.oname + '</span>\
          <span class="del"><a title="Удалить" href="#"><img src="<?=$settings['static'];?>/delete.gif"></a></span>\
        </li>';       
      } //getLineTpl
	  
      function refresh_list() {
        if(id("list") == undefined) return;
        
        id("list").innerHTML = '';
        id("itog_sum").innerHTML = '0';
        ajax("ajax/list.php?from=" + id("date_from").value + "&to=" + id("date_to").value + "&short=1", function(data) {
          var sm = 0;
          data.forEach(function(item, i) {
            sm += item.amount;
            id("list").innerHTML += getLineTpl(item);
          });
          if(data.length == 0) {
            id("list").innerHTML = 'Нет записей';
          }
          id("itog_sum").innerHTML = price(sm);
        });
        return false;
      } //refresh_list
      
      function price(p) {
        return Number(p).toLocaleString();
      } //price
    </script>
  </head>
  <body onload="return refresh_list();">
    <?if(!empty($auth)) {?>
      <h3><?=$auth['msg'];?></h3>
    <?}?>
    <?if($usr->rghts['read'] != 1) {?>
      <form method="post">
        <input type="text" name="login_db_name_list_cb" value="1">
        <input type="text" name="login_usr_name_list_cb" value="1">
        <input type="password" name="password">
        <input type="submit" value="Войти">
      <form>
    <?} else {?>
    <div id="add">
      <input type="button" value="Добавить ↓">
    </div>
    <div id="filter">
      <input id="date_from" type="date" value="<?=date('Y-m-d', time()-3600*24);?>" onchange="return refresh_list();">&nbsp;...&nbsp;
      <input id="date_to" type="date" value="<?=date('Y-m-d');?>" onchange="return refresh_list();">
    </div>
    <ul id="list"></ul>
    <div id="itog">=<span id="itog_sum">0</span><?=$settings['sign'];?></div>
    <?}?>
    <?$settings['add'];?>
  </body>
</html>