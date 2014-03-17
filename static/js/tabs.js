var cash_analit = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analit",
    //layout: 'border',
    collapsible: false,
    tabConfig: {
      title: lang(14),
      tooltip: lang(14) + ' (Alt-3)'
    },
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analit').setLoading(lang(13));
        var p = window.location.hash.split("&");
        loadScript(settings.static + "/js/analiz.js", function() {
          cash_usr_name_list.load(function() {
            Ext.getCmp('cash_analit').add(Ext.getCmp('cash_usr_name_list_cb'));
            Ext.getCmp('cash_analit').add(Ext.getCmp('cash_analit_tabs'));
            setAnkhor();
            Ext.getCmp('cash_analit').setLoading(false);
            setAnalitAnkhor(p);
          });
        });
      }
    }

});//cash_analit


var cash_plan = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_plan",
    layout: 'border',
    collapsible: false,
    tabConfig: {
      title: lang(12),
      tooltip: lang(12) + ' (Alt-2)'
    },
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_analit').setLoading(lang(11));
        var p = window.location.hash.split("&");
        loadScript(settings.static + "/js/plan.js", function() {
          Ext.getCmp('cash_plan').add(Ext.getCmp('cash_plan_tabs'));
          setAnkhor();
          Ext.getCmp('cash_plan').setLoading(false);
        });
      }
    }

});//cash_plan

var cash_sett = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_sett",
    layout: 'vbox',
    collapsible: false,
    tabConfig: {
      title: lang(10),
      tooltip: lang(10) + ' (Alt-4)'
    },
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [],
    listeners: {
      activate: function(tab){
        Ext.getCmp('cash_sett').setLoading(lang(9));
        loadScript(settings.static + "/js/settings.js", function() {
          loadScript(settings.static + "/js/refbooks.js", function() {
            Ext.getCmp('cash_sett').add(cash_set_panel);
            Ext.getCmp('cash_sett').add(cash_refb_tabs);
            setAnkhor();
            Ext.getCmp('cash_sett').setLoading(false);
          });
        });
      }
    }
});//cash_analit

var cash_logout = Ext.create('Ext.button.Button', {
	text: '',
  tooltip: lang(8),
	id: "cash_logout",
	icon: settings.static + "/logout.png",
	handler : logout,
  renderTo: 'logout'
});

var cash_list_tabs = Ext.widget('tabpanel', {
    renderTo: 'main',
    id: "cash_list_tabs",
    defaults :{
      bodyPadding: 5
    },
    listeners: {
      afterrender: function() {
        var map = new Ext.util.KeyMap(document, {
              key: ["1","2","3","4", "5", "6", "7", "8", "9"],
              alt: true,
              fn: function(keyCode) { 
                var tb = Ext.getCmp('cash_list_tabs').items.items[ parseInt(String.fromCharCode(keyCode)) - 1 ];
                if(tb != undefined) {
                  Ext.getCmp('cash_list_tabs').setActiveTab(tb.id);
                }
              }
        });
      }
    },
    border: false,
    items: [cash_list_panel, cash_plan, cash_analit, cash_sett]
});
