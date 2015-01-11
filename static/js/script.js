Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});

Ext.Loader.setPath('Ext.ux', settings.extjs + '/examples/ux');

/***************************
 * included modules
***************************/
Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.menu.*',
    'Ext.form.field.ComboBox',
    'Ext.layout.container.Table',
    'Ext.view.View',
    'Ext.button.*',
    'Ext.Msg',
    'Ext.ux.grid.FiltersFeature',
    'Ext.tab.*',
    'Ext.chart.*',
    'Ext.selection.CellModel'
]);


/* GLOBAL variables */

//user id
var uid = 0;
var db_id = 0;
var rights = [];
var check_lt_id = undefined;

/* RENDER function */

function price(val, metaData, record) {
  var v_def_currency = record.get('sign');

  if(v_def_currency == undefined || v_def_currency == "") v_def_currency = settings.sign;
  
  Ext.util.Format.thousandSeparator = " ";
  if(settings.round == 1) {
    if(val > 0) {
      val = Ext.util.Format.round(val, 0);
    } else {
      val = -1*Ext.util.Format.round(Math.abs(val), 0);
    }
    val = Ext.util.Format.number(val, "0,0");
  } else {
    val = Ext.util.Format.number(val, "0,0.00");
  }  
  return val + v_def_currency;
}

function price_r (val) {
  Ext.util.Format.thousandSeparator = " ";
  if(settings.round == 1) {
    if(val > 0) {
      val = Ext.util.Format.round(val, 0);
    } else {
      val = -1*Ext.util.Format.round(Math.abs(val), 0);
    }
    val = Ext.util.Format.number(val, "0,0");
  } else {
    val = Ext.util.Format.number(val, "0,0.00");
  }
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

function htmlRenderer(text) {
  return Ext.String.htmlEncode(text);
  /*return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");*/
}

function lang(id, params) {
  if(settings.debug == 1 || translate[id] == undefined ) {
    return String(id);
  }
  var tpl = new Ext.Template( translate[id] );
  return tpl.apply(params);
}

/* ----------- bugfix ext js ------------- */

//extjs localization for datefield
Ext.form.field.Date.override({
    initComponent: function () {
        if (!Ext.isDefined(this.initialConfig.startDay)) {
            this.startDay = Ext.picker.Date.prototype.startDay;
        }

        this.callParent();
    }
});

//bugfix extjs 4.2.1 negative number formater
Ext.define('RevRec.util.Format', {
    override: 'Ext.util.Format',
    originalNumberFormatter: Ext.util.Format.number,
    number: function(v, formatString) {
        if (v < 0) {
            //negative number: flip the sign, format then prepend '-' onto output
            return '-' + this.originalNumberFormatter(v * -1, formatString);
        } else {
            //positive number: as you were
            return this.originalNumberFormatter(v, formatString);
        }
    }
});

//CSRF protection
Ext.Ajax.extraParams = {'xcsrf': settings.csrf };

/* ----------- bugfix ext js ------------- */

function error(text, _cb) {
  Ext.Msg.show({
    title: lang(15),
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
function loadScript(path, _calb, _sync) {
  var elms = document.getElementsByTagName('head')[0].children;
  for(var i = 0; i < elms.length; i++) {
    if( (typeof elms[i].src != "undefined") && elms[i].src.indexOf(path) > -1 ) {
      if(_calb != undefined) _calb();
      return false;
    }
  }
  if(_sync == true) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    script.async = false;
    head.appendChild(script);
    
    if(_calb != undefined) {
      script.onreadystatechange= function () {
          if (this.readyState == 'complete') _calb();
      }
      script.onload = _calb;
    }
   
    return true;
  }
  
  path = path + "?" + settings.version;
  
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
  else if(tab == "cash_analit") {
    if(typeof getAnalitAnkhor != "undefined") {
      hash += getAnalitAnkhor();
    }
  }
  else if(tab == "cash_plan") {
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

        loadScript(settings.static + "/js/list.js", function() {
          loadScript(settings.static + "/js/tabs.js", function() {
            Ext.getCmp('cash_sett').setDisabled(parseInt(rights.setting) == 0);
            Ext.getCmp('cash_analit').setDisabled(parseInt(rights.analiz) == 0);
            Ext.getCmp('cash_list_panel').setDisabled(parseInt(rights.read) == 0);
            Ext.getCmp('cash_plan').setDisabled(parseInt(rights.read) == 0);

            Ext.getCmp('cash_list_edit_btn_add').setDisabled(parseInt(rights.write) == 0);
            Ext.getCmp('cash_list_edit_btn_add_check').setDisabled(parseInt(rights.write) == 0);
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
          loadScript(settings.static + "/js/auth.js", function() {
                loginWindow.show();
          });
        }
    } //success
  }); //Ext.Ajax.request
}

function setup() {
  loadScript(settings.static + "/js/setup.js", function() {
        setupWindow.show();
  });
}

function update() {
  loadScript(settings.static + "/js/update.js", function() {
        updateWindow.show();
  });
}

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
  
  if(settings.setup == 1) {
    setup();
  } else if(settings.update == 1) {
    update();
  } else {
    checkAuth();
  }
  Ext.getBody().setHeight(Ext.getBody().getHeight()-10);
}); //Ext.onReady
