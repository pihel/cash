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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
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
      width: 100px;
      height: 25px;
      font-size: 15px;
    }
    input::-webkit-outer-spin-button, /* Removes arrows */
    input::-webkit-inner-spin-button, /* Removes arrows */
    input::-webkit-clear-button { /* Removes blue cross */
      -webkit-appearance: none;
      margin: 0;
    }
    h2 {
      margin: 0px;
      padding: 0px 0px 5px 0px;
      font-size: 16px;
      font-weight: bold;
    }
    #list #no_lines, ul {
      min-height: 150px;
      width: 100%;
      background-color: #DFE9F6;
    }
    #list #no_lines {
      text-align: center;
    }
    ul {
      padding: 0px;
      margin: 0px;
      margin-top: 10px;
      border: 1px solid #A6C9F4;
      background: transparent url("<?=$settings['static'];?>/loading.gif") 50% 50% no-repeat;	
    }
    ul li {
      list-style: none outside none;
      vertical-align: top;
      padding: 10px 5px 10px 5px;
      background-color: #DFE9F6;
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
    #login_form {
      border: 1px solid #A6C9F4;
      width: 300px;
      padding: 5px;
    }
    #login_form div {
      margin-bottom: 5px;
    }
    #login_form input {
      width: 150px;
      margin: 0px auto;
    }
    #login_form label {
      min-width: 140px;
      display: inline-block;
    }
    </style>
    <script language="javascript">      
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
            id("list").innerHTML = '<div id="no_lines">Нет записей<div>';
          }
          id("itog_sum").innerHTML = price(sm);
        });
        return false;
      } //refresh_list
      
      function price(p) {
        return Number(p).toLocaleString();
      } //price
    </script>
    
    <meta http-equiv="x-ua-compatible" content="IE=edge">

    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  <body onload="return refresh_list();">
    <?if(!empty($auth)) {?>
      <h3><?=$auth['msg'];?></h3>
    <?}?>
    <?if($usr->rghts['read'] != 1) {?>
      <form id="login_form" method="post">
        <div><label for="db">База: </label><input type="text" id="db" name="login_db_name_list_cb" value="1"></div>
        <div><label for="login">Пользователь: </label><input type="text" id="login" name="login_usr_name_list_cb" value="1"></div>
        <div><label for="pwd">Пароль: </label><input type="password" id="pwd" name="password"></div>
        <div><input type="submit" value="Войти"></div>
      <form>
    <?} else {?>
    <div id="add">
      <input type="button" value="Добавить ↓">
    </div>
    <div id="filter">
      <input id="date_from" type="date" value="<?=date('Y-m-d', time()-3600*24);?>" onchange="return refresh_list();" required> &mdash;
      <input id="date_to" type="date" value="<?=date('Y-m-d');?>" onchange="return refresh_list();" required>
    </div>
    <ul id="list"></ul>
    <div id="itog">=<span id="itog_sum">0</span><?=$settings['sign'];?></div>
    <?}?>
    <?=$settings['add'];?>
  </body>
</html>