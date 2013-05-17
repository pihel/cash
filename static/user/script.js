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
    'Ext.tab.*'
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
  console.log(window.location.hash);

  return false;
}


function setAnkhor() {
  //save location
  var hash = "#";


  //first tab --- title->id
  var tab = Ext.getCmp('cash_list_tabs').getActiveTab().title;

  if(tab == "Операции") {
    hash += "act=list";
    hash += "&from=" + Ext.Date.format(Ext.getCmp('cash_list_from_date').getValue(),'Y-m-d');
    hash += "&to=" + Ext.Date.format(Ext.getCmp('cash_list_to_date').getValue(),'Y-m-d');

    //extend filter
    if(Ext.getCmp('cash_item_nmcl_cb_fltr') != undefined &&
      Ext.getCmp('cash_list_filter').getValue()
    ) {
      hash += "&exfilter=1";
      hash += "&nmcl_id=" + Ext.getCmp('cash_item_nmcl_cb_fltr').getValue();
      hash += "&nmcl_id_no=" + (0+Ext.getCmp('cash_item_nmcl_cb_fltr_no').getValue());
      hash += "&pt_id=" + Ext.getCmp('cash_item_prod_type_cb_fltr').getValue();
      hash += "&pt_id_no=" + (0+Ext.getCmp('cash_item_prod_type_cb_fltr_no').getValue());
      hash += "&price_from=" + (0+Ext.getCmp('cash_item_price_frm_fltr').getValue());
      hash += "&price_to=" + (0+Ext.getCmp('cash_item_price_to_fltr').getValue());
      hash += "&cur_id=" + Ext.getCmp('cash_item_currency_fltr_cb').getValue();
      hash += "&oper_id=" + Ext.getCmp('cash_item_toper_cb_fltr').getValue();
      hash += "&ctype_id=" + Ext.getCmp('cash_item_ctype_fltr_cb').getValue();
      hash += "&org_id=" + Ext.getCmp('cash_item_org_fltr_cb').getValue();
      hash += "&org_id_no=" + (0+Ext.getCmp('cash_item_org_fltr_cb_no').getValue());
      hash += "&note=" + Ext.getCmp('cash_item_note_fltr').getValue();
      hash += "&note_no=" + (0+Ext.getCmp('cash_item_note_fltr_no').getValue());
      hash += "&file=" + (0+Ext.getCmp('cash_item_file_fltr').getValue());
      hash += "&del=" + (0+Ext.getCmp('cash_item_del_fltr').getValue());
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

    if(restoreAnkhor()) return;

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
