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
	      var cash_sets = Ext.create('Ext.Panel', {
		  layout: 'vbox',
		  border: false,
		  id: "cash_sets",
		  items: [cash_set_panel, cash_refb_tabs]
	      });//cash_sets

	      Ext.getCmp('cash_sett').add(cash_sets);
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
    items: [cash_list_panel, cash_analit, cash_sett]
});
