var cash_list_tabs = Ext.widget('tabpanel', {
    renderTo: Ext.getBody(),
    id: "cash_list_tabs",
    defaults :{
	bodyPadding: 5
    },
    border: false,
    items: [cash_list_panel, {
	title: 'Аналитика',
	listeners: {
	    activate: function(tab){
	      setAnkhor();
	    }
	},
	html: "В разработке"
    },
    {
	title: 'Настройки',
	listeners: {
	    activate: function(tab){
	      setAnkhor();
	    }
	},
	html: "В разработке"
    }]
});
