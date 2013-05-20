Ext.Loader.setConfig({
    enabled: true
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
    'Ext.chart.*'
]);


/* GLOBAL variables */

//user id
var uid = 1;
var def_currency = "р.";

/* RENDER function */
function price(val, metaData, record) {
  var v_def_currency = record.get('sign');

  if(v_def_currency == undefined || v_def_currency == "") v_def_currency = def_currency;
  var val = Ext.util.Format.number(val, "0,0.00");
  val = val.replace(".", " ");
  return val + v_def_currency;
}

function price_r (val) {
  var val = Ext.util.Format.number(val, "0,0.00");
  val = val.replace(".", " ");
  return val + def_currency;
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

  path = path + "?v="+Math.random();//debug

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
  }

  return r;
}

function setAnkhor() {
  //save location
  var hash = "#";

  //first tab --- title->id
  var tab = Ext.getCmp('cash_list_tabs').getActiveTab().title;

  if(tab == "Операции") {
    if(typeof getListAnkhor != "undefined") {
      hash += getListAnkhor();
    }
  }
  else if(tab == "Аналитика") {
    hash += "act=analit";
  }
  else if(tab == "Настройки") {
    hash += "act=set";
  }

  window.location.hash = hash;
  return false;
}

function authOk(id) {
  uid = parseInt(id);

  if(uid > 0) {
    if(typeof loginWindow != "undefined") loginWindow.hide();

    loadScript("static/user/list.js", function() {
      loadScript("static/user/tabs.js", function() {
	if(!restoreAnkhor()) {
	  setDefaultListVal();
	  //listRefresh();
	}
      });
    });
  }
} //authOk

Ext.onReady(function(){
  Ext.QuickTips.init();

  //if user id is empty - login form
  if(uid == 0) {
    loadScript("static/user/auth.js", function() {
	loginWindow.show();
    });

  } else {
    authOk(uid);
  }

}); //Ext.onReady
