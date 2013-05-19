var cash_list_tabs = Ext.widget('tabpanel', {
    renderTo: Ext.getBody(),
    id: "cash_list_tabs",
    defaults :{
	bodyPadding: 5
    },
    border: false,
    items: [cash_list_panel, {
	title: 'Аналитика',
	id: "cash_analit",
	listeners: {
	    activate: function(tab){
	      setAnkhor();
	    }
	},
	html: "В разработке"
    },
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
