Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});

Ext.Loader.setPath('Ext.ux', 'static/ext/ux');

/***************************
 * included modules
***************************/
Ext.require([
    'Ext.data.*',
    //'Ext.tip.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.state.*',
    //'Ext.tip.QuickTipManager',
    'Ext.menu.*',
    'Ext.form.field.ComboBox',
    'Ext.layout.container.Table',
    'Ext.view.View',
    'Ext.button.*',
    'Ext.Msg',
    'Ext.ux.grid.FiltersFeature',
    'Ext.tab.*',
    'Ext.chart.*',
    'Ext.ux.CheckColumn',
    'Ext.selection.CellModel'
]);


/* GLOBAL variables */

//user id
var uid = 0;
var db_id = 0;
var rights = [];
var settings = [];
var check_lt_id = undefined;

/* RENDER function */
function price(val, metaData, record) {
  var v_def_currency = record.get('sign');

  if(v_def_currency == undefined || v_def_currency == "") v_def_currency = settings.sign;
  var val = Ext.util.Format.number(val, "0,0.00");
  val = val.replace(".", " ");
  return val + v_def_currency;
}

function price_r (val) {
  var val = Ext.util.Format.number(val, "0,0.00");
  val = val.replace(".", " ");
  return val + settings.sign;
}

function dateRender(value) {
  var dt = new Date(value);
  var val = Ext.Date.format(dt,'Y-m-d');
  return val;
}

function dateTimeRender(value) {
  var dt = new Date(value);
  var val = Ext.Date.format(dt,'Y-m-d H:i');
  return val;
}

function error(text, _cb) {
  Ext.Msg.show({
    title:'Ошибка',
    msg: text,
    icon: Ext.MessageBox.ERROR,
    buttons: Ext.Msg.OK,
    fn: function() {
      if(_cb != undefined) _cb();
    }
  });
}

/* --END RENDER function */


//require once js script
function loadScript(path, _calb) {
  var elms = document.getElementsByTagName('head')[0].children;
  for(var i = 0; i < elms.length; i++) {
    if( (typeof elms[i].src != "undefined") && elms[i].src.indexOf(path) > -1 ) {
      if(_calb != undefined) _calb();
      return false;
    }
  }

  //path = path + "?v=0.99";
  path = path + "?v=" + Math.random();//debug

  Ext.Loader.loadScript({url: path, scope: this,
    onLoad: function() {
      if(_calb != undefined) _calb();
    }
  });

  return true;
} //loadScript


function restoreAnkhor() {
  var p = window.location.hash.split("&");
  if(p.length < 1) return false;

  var r = false;
  if(typeof setListAnkhor != "undefined" && p[0] == "#act=list") {
    r = setListAnkhor();
  } else if(p[0] == "#act=analit") {
    Ext.getCmp('cash_list_tabs').setActiveTab("cash_analit");
  } else if(p[0] == "#act=set") {
    Ext.getCmp('cash_list_tabs').setActiveTab("cash_sett");
  } else if(p[0] == "#act=plan") {
    Ext.getCmp('cash_list_tabs').setActiveTab("cash_plan");
  }

  return r;
}

function setAnkhor() {
  //save location
  var hash = "#";

  //first tab --- title->id
  var tab = Ext.getCmp('cash_list_tabs').getActiveTab().id;

  if(tab == "cash_list_panel") {
    if(typeof getListAnkhor != "undefined") {
      hash += getListAnkhor();
    }
  }
  else if(tab == "cash_plan") {
    if(typeof getAnalitAnkhor != "undefined") {
      hash += getAnalitAnkhor();
    }
  }
  else if(tab == "cash_analit") {
    hash += "act=plan";
  }
  else if(tab == "cash_sett") {
    hash += "act=set";
  }

  window.location.hash = hash;
  return false;
}

function checkLifeTime() {
  if(uid == 0 && check_lt_id != undefined) {
    clearInterval(check_lt_id);
    return;
  }
  if(uid == 0) return;

  Ext.Ajax.request({
    url: "ajax/session.php",
    method: "GET",
    success: function(data) {
        if(parseInt(data.responseText) != 1) {
            uid = 0;
            window.location.reload();
        }
    } //success
  }); //Ext.Ajax.request
}

function authOk(id) {
  uid = parseInt(id);

  if(uid > 0) {
    if(typeof loginWindow != "undefined") loginWindow.hide();

    //load rights
    Ext.Ajax.request({
      url: "ajax/get_usr_rght.php",
      method: "GET",
      success: function(data) {
        rights = Ext.decode(data.responseText);
        db_id = parseInt(rights.bd_id);
        
        var dt = Ext.Date.add(new Date(), Ext.Date.YEAR, 1);
        Ext.util.Cookies.set("DB_ID", db_id, dt );
        Ext.util.Cookies.set("USR_ID", uid, dt );

        Ext.Ajax.request({
          url: "ajax/settings.php",
          method: "GET",
          success: function(data) {
            settings = Ext.decode(data.responseText);

            loadScript("static/user/list.js", function() {
              loadScript("static/user/tabs.js", function() {
                Ext.getCmp('cash_sett').setDisabled(parseInt(rights.setting) == 0);
                Ext.getCmp('cash_analit').setDisabled(parseInt(rights.analiz) == 0);
                Ext.getCmp('cash_list_panel').setDisabled(parseInt(rights.read) == 0);
                Ext.getCmp('cash_plan').setDisabled(parseInt(rights.read) == 0);

                Ext.getCmp('cash_list_edit_btn_add').setDisabled(parseInt(rights.write) == 0);
                Ext.getCmp('cash_list_edit_col').setVisible(parseInt(rights.write) == 1);

                if(!restoreAnkhor()) {
                  setDefaultListVal();
                  //listRefresh();
                }
                
                check_lt_id = window.setInterval(function() {
                  checkLifeTime();
                }, 60000);
              });
            });

          } //success
        }); //Ext.Ajax.request
      } //success
    }); //Ext.Ajax.request
  }
} //authOk

function checkAuth() {
  Ext.Ajax.request({
      url: "ajax/get_usr.php",
      method: "GET",
      success: function(data) {
        if( parseInt(data.responseText) > 0 ) {
          if(parseInt(uid) > 0 && Ext.getCmp('cash_list_panel') != undefined) {
              return;
          }
          uid = parseInt(data.responseText);
          authOk(uid);
        } else {
          if(parseInt(uid) > 0) {
              uid = 0;
              window.location.reload();
              return;
          }
          loadScript("static/user/auth.js", function() {
                loginWindow.show();
          });
        }
    } //success
  }); //Ext.Ajax.request
}

function logout() {
  Ext.Ajax.request({
    url: "ajax/logout.php",
    method: "GET",
    success: function(data) {
      uid = 0;
      window.location.reload();
    } //success
  }); //Ext.Ajax.request
}

if(window.addEventListener) {
  window.addEventListener('focus', function() {
      checkLifeTime();
  });
}

Ext.onReady(function(){
  Ext.QuickTips.init();
  checkAuth();
}); //Ext.onReady
