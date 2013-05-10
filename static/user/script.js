Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', 'static/ext/ux');

/***************************
 * included modules
***************************/
Ext.require([
    'Ext.tree.*',
    'Ext.data.*',
    'Ext.tip.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.tip.QuickTipManager',
    'Ext.menu.*',
    'Ext.form.field.ComboBox',
    'Ext.layout.container.Table',
    'Ext.view.View',
    'Ext.button.*',
    'Ext.Msg',
    'Ext.ux.grid.FiltersFeature',
    'Ext.ux.statusbar.StatusBar',
    'Ext.ux.CheckColumn',
    'Ext.selection.CellModel',
    'Ext.tab.*',
    'Ext.Window.*'
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

  /*var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.onreadystatechange= function () {
     if (this.readyState == 'complete')  {
       if(_calb != undefined) _calb();
     }
  }
  if(_calb != undefined) {
    script.onload = _calb;
  }
  script.src = path;
  head.appendChild(script);*/

  path = path + "?v="+Math.random();//debug

  Ext.Loader.loadScript({url: path, scope: this,
    onLoad: function() {
	if(_calb != undefined) _calb();
    }
  });

  return true;
} //loadScript


function setAnkhor() {
  //save location
  window.location.hash = "#";
  return false;
}

function authOk(id) {
  uid = parseInt(id);

  if(uid > 0) {
    if(typeof loginWindow != "undefined") loginWindow.hide();
    loadScript("static/user/list.js", function() {
      loadScript("static/user/tabs.js", function() {
	listRefresh();
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
