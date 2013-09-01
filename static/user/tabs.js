var cash_analit = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_analit",
    layout: 'border',
    collapsible: false,
    title: 'Аналитика',
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  Ext.getCmp('cash_analit').setLoading("Загрузка аналитики...");
	  var p = window.location.hash.split("&");
	  loadScript("static/user/analiz.js", function() {
	    Ext.getCmp('cash_analit').add(Ext.getCmp('cash_analit_tabs'));
	    setAnkhor();
	    Ext.getCmp('cash_analit').setLoading(false);
	    setAnalitAnkhor(p);
	  });
	}
    }

});//cash_analit


var cash_plan = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_plan",
    layout: 'border',
    collapsible: false,
    title: 'Планирование',
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  Ext.getCmp('cash_analit').setLoading("Загрузка планов...");
	  var p = window.location.hash.split("&");
	  loadScript("static/user/plan.js", function() {
	    Ext.getCmp('cash_plan').add(Ext.getCmp('cash_plan_panel'));
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
    title: 'Настройки',
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  Ext.getCmp('cash_sett').setLoading("Загрузка настроек...");
	  loadScript("static/user/settings.js", function() {
	    loadScript("static/user/refbooks.js", function() {
	      Ext.getCmp('cash_sett').add(cash_set_panel);
	      Ext.getCmp('cash_sett').add(cash_refb_tabs);
	      setAnkhor();
	      Ext.getCmp('cash_sett').setLoading(false);
	    });
	  });
	}
    }

});//cash_analit

var cash_list_tabs = Ext.widget('tabpanel', {
    renderTo: Ext.getBody(),
    id: "cash_list_tabs",
    defaults :{
	bodyPadding: 5
    },
    border: false,
    items: [cash_list_panel, cash_plan, cash_analit, cash_sett]
});
