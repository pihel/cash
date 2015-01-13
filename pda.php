<?
require_once('lib/init.php');
if($settings['setup'] == 1 || $settings['update'] == 1) {
  header("Location: index.php");
  exit;
}

$auth = array();
if(!empty($_POST['login_usr_name_list_cb'])) {
  $auth = $usr->auth($_POST);
  if($auth['success'] == 1) {
    header("Location: pda.php");
    exit;
  }
}
if(!empty($_POST['cash_item_save'])) {
  $add_ret = $ch->add($_POST, $_FILES);
  if($add_ret['success'] == 1) {
    header("Location: pda.php");
    exit;
  }
}
?>
<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title><?=$settings['site_name'];?> &mdash; <?=$lng->get(199);?></title>
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
    #add input[type=button],#add input[type=submit] {
      width: 100%;
      height: 35px;
      cursor: pointer;
    }
    #filter {
      margin: 0px auto;
      text-align: center;
    }
    input {
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
    #list .del img {
      width: 16px;
      height: 16px;
    }
    #login_form {
      border: 1px solid #A6C9F4;
      width: 240px;
      padding: 5px;
    }
    #login_form div {
      margin-bottom: 5px;
    }
    #login_form input, #login_form select {
      width: 140px;
      margin: 0px auto;
      border: 1px solid #A6C9F4;
      font-size: 15px;
    }
    #login_form #pwd {
      position: relative;
      right: -3px;
    }
    #login_form input[type=submit] {
      cursor: pointer;
      width: 99%;
    }
    #login_form label {
      min-width: 90px;
      display: inline-block;
    }
    #add_frm {
      display: none;
      border: 1px solid #A6C9F4;
      border-radius: 0px 0px 5px 5px;
      padding: 10px;
    }
    #add_frm label {
      min-width: 50px;
      padding-right: 5px;
      display: inline-block;
    }
    #add_frm input {
      width: 165px;
    }
    #add_frm label[for=cash_item_qnt] {
      min-width: 1px;
    }
    #add_frm div {
      margin-bottom: 5px;
    }
    #add_frm #cash_item_price {
      width: 60px;
    }
    #add_frm #cash_item_qnt {
      width: 40px;
    }
    #filter input, #add_frm #cash_item_date {      
      width: 110px;   
      border: 1px solid #A6C9F4;      
    }
    #lgif {
      margin-left: 15px;
      vertical-align: middle;
      width: 23px;
      display: none;
    }
    #nmcl_list {
      background-color: #fff;
      border: 1px solid #ccc;
      left: 55px;
      margin-top: -3px;
      position: absolute;
      width: 165px;
    }
    #nmcl_list div {
      height: 22px;
      overflow: hidden;
      padding: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 155px;
      margin: 0px;
    }
    #nmcl_list div:hover {
      cursor: pointer;
      background-color: #eee;
    }
    </style>
    <script language="javascript">
      function id(p_id) {
        return document.getElementById(p_id);
      } //id
      
      function ajax(url, _cb, np, post) {
        request = new XMLHttpRequest;
        
        if( url.indexOf("?") == -1 ) {
          url = url + "?";
        } else {
          url = url + "&";
        }
        url = url + "xcsrf=<?=$settings['csrf'];?>";
        
        if(post != undefined) {
          request.open('POST', url, true);
          request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          //request.setRequestHeader("Content-Length", post.length);
        } else {
          request.open('GET', url, true);
        }

        request.onload = function() {
          if (request.status >= 200 && request.status < 400){
            if(np) {
              _cb(request.responseText);
            } else {
              _cb(JSON.parse(request.responseText));
            }
          } 
        }

        request.send(post);
      } //ajax
      
      function getLineTpl(o) {
        var class_name = "out";
        if(o.amount > 0) {
          class_name = "in";
        }
        return '<li>\
          <span class="date">'+o.dt+'</span>\
          <span class="amount ' + class_name + '">' + price(o.amount) + '<?=$settings['sign'];?></span>\
          <h2 class="name">' + o.nom + '</h2>\
          <span class="org">' + o.oname + '</span>\
          <span class="del"><a title="<?=$lng->get(37);?>" href="#" onclick="return del('+o.id+');"><img src="<?=$settings['static'];?>/delete.gif"></a></span>\
        </li>';       
      } //getLineTpl
	  
      function refresh_list() {
        if(id("list") == undefined) return;
        //var start = (new Date()).getTime();
        
        id("list").innerHTML = '';
        id("itog_sum").innerHTML = '0';
        ajax("ajax/list.php?from=" + id("date_from").value + "&to=" + id("date_to").value + "&short=1", function(data) {
          var sm = 0;
          var html = "";
          data.forEach(function(item, i) {
            sm += item.amount;
            html += getLineTpl(item);
          });
          //html = data.map(getLineTpl).join('');
          if(data.length == 0) {
            id("list").innerHTML = '<div id="no_lines"><?=$lng->get(201);?><div>';
          } else {
            id("list").innerHTML += html;
          }
          id("itog_sum").innerHTML = price(sm);
          //console.log( ( (new Date()).getTime() - start ) /1000 );
        });
        return false;
      } //refresh_list
      
      function price(p) {
        return Number(p).toLocaleString();
      } //price
      
      function del(id) {
        if(confirm("<?=$lng->get(41);?>")) {
          ajax("ajax/delete.php?id=" + id, function(data) {
            if(parseInt(data) > 0) {
              refresh_list();
            } else {
              alert(data);
            }
          }, true);
        }
        return false;
      }//del
      
      function add_frm() {
        id("add_frm").style.display = 'block';
        id("add_btn").style.display = 'none';
        reloadLocation();      
        id("cash_item_nmcl_cb").focus();
        return false;
      } //add_frm
      
      function add(o) {
        var send = "";
        id("lgif").style.display = 'inline';
        reloadLocation();
        for(var i = 0; i < id("add_frm").elements.length; i++) {
          if(i > 0) send += "&";
          send += id("add_frm").elements[i].name + "=" + encodeURIComponent( id("add_frm").elements[i].value );
        }
        ajax("ajax/add.php", function(data) {
          if(data.success) {
            //clear
            id("cash_item_nmcl_cb").value = "";
            id("cash_item_prod_type_cb").value = "";
            id("cash_item_org_cb").value = "";
            id("cash_item_price").value = "";
            id("cash_item_qnt").value = 1;
            //refresh
            refresh_list();
          } else {
            alert(data.msg);
          }
          id("lgif").style.display = 'none';
          id("cash_item_nmcl_cb").focus();
        }, 0, send);
        return false;
      }//add
      
      function nomChange(o) {
        if( id("nmcl_list").style.display == 'block' ) return;
        if( o.value == "" ) return;
        id("lgif").style.display = 'inline';
        ajax("ajax/nmcl_param.php?nmcl_name=" + encodeURIComponent( o.value ), function(data) {
          if(data != null) {
            id("cash_item_prod_type_cb").value = data.gr_name;
            id("cash_item_org_cb").value = data.org_name;
            id("cash_item_price").focus();
          } else {
            id("cash_item_prod_type_cb").value = "";
            id("cash_item_org_cb").value = "";
          }
          id("lgif").style.display = 'none';
        } );
      } //nomChange
      
      window.onload = function () {
          refresh_list();
      }
      
      function fillcheck() {
        var t = id("cash_item_nmcl_cb").value;
        id("nmcl_list").style.display = 'none';
        if(t.length > 3 ) {
          id("lgif").style.display = 'inline';
          ajax("ajax/nmcl_list.php?edit_id=0&limit=5&query=" + encodeURIComponent( t ), function(data) {
            if(data != null) {
              var h = "";
              for (var k in data) {
                h += "<div onclick=\"return fill('"+data[k].name+"')\">"+data[k].name+"</div>";
              } 
              if(h != "") {
                id("nmcl_list").innerHTML = h;
                id("nmcl_list").style.display = 'block';
              }
            }
            id("lgif").style.display = 'none';
          } );
        }
        return true;
      } //fillcheck
      
      function fill(itm) {
        id("nmcl_list").style.display = 'none';
        if(itm != undefined) {
          id("cash_item_nmcl_cb").value = itm;
          nomChange(id("cash_item_nmcl_cb"));
        }
      } //fill
      
      function getLocation(_fnc) {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(pos) {
                //console.log("lat:" + pos.coords.latitude + ", long:" + pos.coords.longitude);
                if(typeof _fnc != "undefined") _fnc(pos.coords.latitude, pos.coords.longitude);
              });
          } else {
              if(typeof _fnc != "undefined") _fnc(0, 0);
          }
      } //getLocation
      
      function reloadLocation() {
        getLocation(function(lat, lon) {
          id("cash_item_geo").value = lat+";"+lon;
        });
        return true;
      }

    </script>
    
    <meta http-equiv="x-ua-compatible" content="IE=edge">

    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  <body onclick="return fill();">
    <?if(!empty($auth)) {?>
      <h3><?=$auth['msg'];?></h3>
    <?}?>
    <?if($usr->rghts['read'] != 1) {
      require_once("lib/settings.php");
      $set = new CashSett($db, $usr);
    ?>
      <form id="login_form" method="post">
        <div><label for="db"><?=$lng->get(7);?>: </label>
        <select id="db" name="login_db_name_list_cb">
          <?
          $dbs = $set->getDbs();
          foreach($dbs as $db) {
          ?>
          <option value="<?=$db['id'];?>"<?if($db['id']==$_COOKIE['DB_ID']){?> selected<?}?>><?=$db['name'];?></option>
          <?}?>
        </select> </div>
        <div><label for="login"><?=$lng->get(6);?>: </label>
        <select id="login" name="login_usr_name_list_cb">
          <?
          $usrs = $set->getUsrNames();
          foreach($usrs as $u) {
          ?>
          <option value="<?=$u['id'];?>"<?if($u['id']==$_COOKIE['USR_ID']){?> selected<?}?>><?=$u['name'];?></option>
          <?}?>
        </select></div>
        <div><label for="pwd"><?=$lng->get(3);?>: </label><input type="password" id="pwd" name="password"></div>
        <div><input type="submit" value="<?=$lng->get(2);?>"></div>
      </form>
    <?} else {?>
    <div id="add">
      <input type="button" id="add_btn" value="<?=$lng->get(49);?> ↓" onclick="return add_frm();">
      <?if(!empty($add_ret['msg'])) {?>
        <h3><?=$lng->get(164);?>: <?=$add_ret['msg'];?></h3>
      <?}?>
      <form method="post" id="add_frm" onsubmit="return add(this);">
        <input type="hidden" id="cash_item_currency_cb" name="cash_item_currency_cb" value="1">
        <input type="hidden" id="cash_item_ctype_cb" name="cash_item_ctype_cb" value="1">
        <input type="hidden" id="cash_item_toper_cb" name="cash_item_toper_cb" value="0">
        <input type="hidden" id="cash_item_note" name="cash_item_note" value="">
        <input type="hidden" id="cash_item_geo" name="cash_item_geo" value="0;0">
        <div><label for="cash_item_date"><?=$lng->get(23);?></label><input type="date" name="cash_item_date" id="cash_item_date" value="<?=date('Y-m-d');?>"><img id="lgif" src="<?=$settings['static'];?>/loading.gif"></div>
        <div style="position:relative;">
          <label for="cash_item_nmcl_cb"><?=$lng->get(17);?></label><input type="text" name="cash_item_nmcl_cb" id="cash_item_nmcl_cb" onkeyup="return fillcheck();" onchange="return nomChange(this);" onclick="return reloadLocation();">
          <div id="nmcl_list"></div>
        </div>
        <div><label for="cash_item_prod_type_cb"><?=$lng->get(19);?></label><input type="text" name="cash_item_prod_type_cb" id="cash_item_prod_type_cb"></div>
        <div><label for="cash_item_org_cb"><?=$lng->get(200);?></label><input type="text" name="cash_item_org_cb" id="cash_item_org_cb"></div>
        <div>
          <label for="cash_item_price"><?=$lng->get(20);?></label><input type="number" name="cash_item_price" id="cash_item_price"> 
          <label for="cash_item_qnt"><?=$lng->get(21);?></label><input type="number" name="cash_item_qnt" id="cash_item_qnt" value="1">
        </div>
        <input name="cash_item_save" id="cash_item_save" type="submit" value="<?=$lng->get(58);?>">        
      </form>
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