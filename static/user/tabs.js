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
	  loadScript("static/user/analiz.js", function() {
	    Ext.getCmp('cash_analit').add(Ext.getCmp('cash_analit_tabs'));
	    setAnkhor();
	    Ext.getCmp('cash_analit').setLoading(false);
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
    items: [cash_list_panel, cash_analit,
    {
	title: 'Настройки',
	id: "cash_sett",
	listeners: {
	    activate: function(tab){
	      setAnkhor();
	    }
	},
	html: "В разработке"
    }]
});
