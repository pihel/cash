var glob_hash = [];
var w = Ext.getCmp('cash_analit').getWidth() - 20;
var h = Ext.getCmp('cash_analit').getHeight() - 45;

var cash_analiz_com = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_com",
    title: 'Общий',
    height: h,
    width: w,
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_com').setLoading("Загрузка общей статистики...");
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
    title: 'Баланс',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_dyn').setLoading("Загрузка баланса...");
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
    title: 'Группы',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_group').setLoading("Загрузка статистики по группам...");
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
    title: 'Динамика групп',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_group_dyn').setLoading("Загрузка статистики по динамике групп...");
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
    title: 'Организации',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_org').setLoading("Загрузка статистики по организациям...");
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
    title: 'Динамика',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_mondyn').setLoading("Загрузка динамики по месяцам...");
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
    title: 'Кошельки',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_cash_type').setLoading("Загрузка статистики по кошелькам...");
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
    title: 'Накопления',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_rest').setLoading("Загрузка накоплений...");
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
    title: 'Валюты',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_curr').setLoading("Загрузка статистики по валютам...");
        loadScript(settings.static + "/js/analiz/cur_amount.js", function() {
          cash_analiz_cur_load(function() {
            Ext.getCmp('cash_analiz_curr').setLoading(false);
            setAnkhor();
          });
        });
      }
    }

});//cash_analiz_curr

var cash_analiz_secr = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analiz_secr",
    height: h,
    width: w,
    title: 'Безопасность',
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analiz_secr').setLoading("Загрузка статистики по финансовой безопасности...");
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
	    cash_analiz_org, cash_analiz_cash_type, cash_analiz_curr, cash_analiz_secr, cash_analiz_rest]
}); //cash_analit_tabs