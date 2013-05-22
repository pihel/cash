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
	  setAnkhor();
	  loadScript("static/user/analiz/common.js", function() {
	    cash_analiz_com_load(function() {
	      Ext.getCmp('cash_analiz_com').setLoading(false);
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
	  setAnkhor();
	  loadScript("static/user/analiz/dynamic.js", function() {
	    cash_analiz_dyn_load(function() {
	      Ext.getCmp('cash_analiz_dyn').setLoading(false);
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
	  setAnkhor();
	  loadScript("static/user/analiz/groups.js", function() {
	    cash_analiz_grp_load(function() {
	      Ext.getCmp('cash_analiz_group').setLoading(false);
	    });
	  });
	}
    }

});//cash_analiz_group

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
	  setAnkhor();
	  loadScript("static/user/analiz/orgs.js", function() {
	    cash_analiz_org_load(function() {
	      Ext.getCmp('cash_analiz_org').setLoading(false);
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
	  //
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
	  setAnkhor();
	  loadScript("static/user/analiz/purs.js", function() {
	    cash_analiz_purs_load(function() {
	      Ext.getCmp('cash_analiz_cash_type').setLoading(false);
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
	  setAnkhor();
	  loadScript("static/user/analiz/storg.js", function() {
	    cash_analiz_strg_load(function() {
	      Ext.getCmp('cash_analiz_rest').setLoading(false);
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
	  //
	}
    }

});//cash_analiz_curr


var cash_analit_tabs = Ext.widget('tabpanel', {
    id: "cash_analit_tabs",
    defaults :{
	bodyPadding: 5
    },
    border: false,
    items: [cash_analiz_com, cash_analiz_dyn, cash_analiz_group, cash_analiz_org, cash_analiz_mondyn, cash_analiz_cash_type, cash_analiz_rest, cash_analiz_curr]
}); //cash_analit_tabs