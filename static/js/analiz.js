var glob_hash = [];
var w = Ext.getCmp('cash_analit').getWidth() - 20;
var h = Ext.getCmp('cash_analit').getHeight() - 70;

//---user

var cash_id_name_model = Ext.define('cash_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',      type: 'INT'},
        {name: 'name',    type: 'text'}
    ],
    idProperty: 'id'
});

var cash_usr_name_list = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/analiz/usr_list_analiz.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_usr_name_list

var cash_usr_name_list_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_usr_name_list,
    id: "cash_usr_name_list_cb",
    name: "cash_usr_name_list_cb",
    fieldLabel: lang(30),
    labelWidth: 100,
    editable: false,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    value: -1,
    listeners: {
      select: function( combo, records, e) {
        var tab_id = Ext.getCmp('cash_analit_tabs').getActiveTab().id;
        window[tab_id+'_refresh'](); //tab refresh
      }
    }
}); //cash_usr_name_list_cb

function getUsrFltr() {
  var u = Ext.getCmp('cash_usr_name_list_cb').getValue();
  if(parseInt(u) > 0) {
    return "&usr=" + parseInt(u);
  }
  return "";
} //getUsrFltr

//---user

var cash_analiz_com = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_com",
    title: lang(85),
    height: h,
    width: w,
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_com').setLoading(lang(86));
        loadScript(settings.static + "/js/analiz/common.js", function() {
          cash_analiz_com_load(function() {
            Ext.getCmp('cash_analiz_com').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_com

var cash_analiz_dyn = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_dyn",
    height: h,
    width: w,
    title: lang(87),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_dyn').setLoading(lang(88));
        loadScript(settings.static + "/js/analiz/dynamic.js", function() {
          cash_analiz_dyn_load(function() {
            Ext.getCmp('cash_analiz_dyn').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_dyn

var cash_analiz_group = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_group",
    height: h,
    width: w,
    title: lang(89),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_group').setLoading(lang(90));
        loadScript(settings.static + "/js/analiz/groups.js", function() {
          cash_analiz_grp_load(function() {
            Ext.getCmp('cash_analiz_group').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_group

var cash_analiz_group_dyn = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_group_dyn",
    height: h,
    width: w,
    title: lang(91),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_group_dyn').setLoading(lang(92));
        loadScript(settings.static + "/js/analiz/groups_dyn.js", function() {
          cash_analiz_grp_dyn_load(function() {
            Ext.getCmp('cash_analiz_group_dyn').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_group_dyn

var cash_analiz_org = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_org",
    height: h,
    width: w,
    title: lang(93),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_org').setLoading(lang(94));
        loadScript(settings.static + "/js/analiz/orgs.js", function() {
          cash_analiz_org_load(function() {
            Ext.getCmp('cash_analiz_org').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_org

var cash_analiz_mondyn = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_mondyn",
    height: h,
    width: w,
    title: lang(95),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_mondyn').setLoading(lang(96));
        loadScript(settings.static + "/js/analiz/mon_dyn.js", function() {
          cash_analiz_mdyn_load(function() {
            Ext.getCmp('cash_analiz_mondyn').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_mondyn

var cash_analiz_cash_type = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_cash_type",
    height: h,
    width: w,
    title: lang(97),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_cash_type').setLoading(lang(98));
        loadScript(settings.static + "/js/analiz/purs.js", function() {
          cash_analiz_purs_load(function() {
            Ext.getCmp('cash_analiz_cash_type').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_cash_type

var cash_analiz_rest = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_rest",
    height: h,
    width: w,
    title: lang(99),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_rest').setLoading(lang(100));
        loadScript(settings.static + "/js/analiz/storg.js", function() {
          cash_analiz_strg_load(function() {
            Ext.getCmp('cash_analiz_rest').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_rest

var cash_analiz_curr = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_curr",
    height: h,
    width: w,
    title: lang(101),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_curr').setLoading(lang(102));
        loadScript(settings.static + "/js/analiz/cur_amount.js", function() {
          cash_analiz_cur_load(function() {
            Ext.getCmp('cash_analiz_curr').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_curr

var cash_analiz_geo = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_geo",
    height: h,
    width: w,
    title: lang(227),
    items: [],
    listeners: {
      activate: function(tab){
        //document.write('<' + 'script async="false" src="http://maps.google.com/maps/api/js?sensor=false"><' + '/script>');
        //document.write('<' + 'script async="false" src="' + settings.extjs + '/examples/ux/GMapPanel.js"><' + '/script>');
        //loadScript("http://maps.google.com/maps/api/js?sensor=false", function() {
        //  loadScript(settings.extjs + "/examples/ux/GMapPanel.js", function() {
            Ext.getCmp('cash_analiz_geo').setLoading(lang(227));
            loadScript(settings.static + "/js/analiz/geo_map.js", function() {
              cash_analiz_geo_load(function() {
                Ext.getCmp('cash_analiz_geo').setLoading(false);
                setAnkhor();
              });
            }); //loadScript: geo_map
        //  }, true); //loadScript: GMapPanel
        //}, true); //loadScript: maps.google.com
      }
    }

});//cash_analiz_geo

var cash_analiz_secr = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_secr",
    height: h,
    width: w,
    title: lang(103),
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_secr').setLoading(lang(104));
        loadScript(settings.static + "/js/analiz/secr.js", function() {
          cash_analiz_secr_load(function() {
            Ext.getCmp('cash_analiz_secr').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_secr


function getAnalitAnkhor() {
  var hash = "";
  hash += "act=analit";
  hash += "&type=" + Ext.getCmp('cash_analit_tabs').getActiveTab().id;

  if(typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1] != "undefined" &&
     typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items != "undefined"
  ) {
    if(Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].$className == "Ext.form.field.Date") {
      hash += "&from=" + Ext.Date.format(Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].getValue(),'Y-m-d');
    }
    if(typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[2] != "undefined" &&
        Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[2].$className == "Ext.form.field.Date") {
      hash += "&to=" + Ext.Date.format(Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[2].getValue(),'Y-m-d');
    }

    if(Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items.length > 3 ) {
      hash += "&in=" + (0+Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[4].getValue());
    }

    //исключение для вкладки безопасности
    if(typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items != "undefined" &&
      Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.length > 5) {

       hash += "&amount=" + Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[0].getValue();
       hash += "&in_amount=" + Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[1].getValue();
       hash += "&in_proc=" + Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[2].getValue();
       hash += "&out_amount=" + Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[4].getValue();
       hash += "&out_proc=" + Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[5].getValue();
    }
  }
  return hash;
}

function setAnalitAnkhorParam() {
  if(glob_hash == undefined || glob_hash == "" || glob_hash == []) return false;
  if(glob_hash.length < 2) return false;
  if(glob_hash[0] != "#act=analit") return false;

  if(typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1] == "undefined" ||
      typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items == "undefined"
    ) return false;

  //alert(glob_hash);

  Ext.Array.each(glob_hash, function(name, index, countriesItSelf) {
    var h = name.split("=");
    if(h.length < 2) return false;

    if(h[0] == "from") Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].setValue(h[1]);
    if(h[0] == "to") Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[2].setValue(h[1]);
    if(h[0] == "in") {
      Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[4].setDisabled(false);
      if(Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[4].$className == "Ext.form.field.ComboBox") {
        Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[4].setValue(parseInt(h[1]));
      } else {
        Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[4].setValue(parseInt(h[1])==1);
      }
    }

    //исключение для вкладки безопасности
    if(typeof Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items != "undefined" &&
      Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.length > 5) {
      if(h[0] == "amount" && h[1] != "null" ) Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[0].setValue(h[1]);
      if(h[0] == "in_amount" && h[1] != "null") Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[1].setValue(h[1]);
      if(h[0] == "in_proc") Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[2].setValue(h[1]);
      if(h[0] == "out_amount" && h[1] != "null") Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[4].setValue(h[1]);
      if(h[0] == "out_proc") Ext.getCmp('cash_analit_tabs').getActiveTab().items.items[1].items.items[0].items.items[5].setValue(h[1]);
    }
  }); //Ext.Array.each

  glob_hash = [];

  return true;
}

function setAnalitAnkhor(p) {
  if(p.length < 2) return false;
  if(p[0] != "#act=analit") return false;

  Ext.Array.each(p, function(name, index, countriesItSelf) {
    var h = name.split("=");
    if(h.length < 2) return false;

    if(h[0] == "type") {
      glob_hash = p;
      Ext.getCmp('cash_analit_tabs').setActiveTab(h[1]);
      return true;
    }
  }); //Ext.Array.each

  return true;
}

function isDefaultAnaliz() {
  return glob_hash == undefined ||
	 glob_hash == "" || glob_hash == [] || glob_hash.length < 3;
	 //|| ( "type=" + Ext.getCmp('cash_analit_tabs').getActiveTab().id == "cash_analiz_com" && typeof glob_hash[1] != "type=cash_analiz_com" );
}

var cash_analit_tabs = Ext.widget('tabpanel', {
    id: "cash_analit_tabs",
    defaults :{
      bodyPadding: 5
    },
    border: false,
    items: [cash_analiz_com, cash_analiz_dyn, cash_analiz_mondyn, cash_analiz_group, cash_analiz_group_dyn,
	    cash_analiz_org, cash_analiz_cash_type, cash_analiz_curr, cash_analiz_geo, cash_analiz_secr, cash_analiz_rest]
}); //cash_analit_tabs