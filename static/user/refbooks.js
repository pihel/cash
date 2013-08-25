var cash_refb_group = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_group",
    collapsible: false,
    title: 'Группы товара',
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  //
	}
    }

});//cash_refb_group

var cash_refb_cur = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_cur",
    collapsible: false,
    title: 'Валюты',
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  //
	}
    }

});//cash_refb_cur

var cash_refb_org = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_org",
    collapsible: false,
    title: 'Организации',
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  //
	}
    }

});//cash_refb_org

var cash_refb_type = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_type",
    collapsible: false,
    title: 'Кошельки',
    header: true,
    items: [],
    listeners: {
	activate: function(tab){
	  //
	}
    }

});//cash_refb_type



var cash_refb_tabs = Ext.widget('tabpanel', {
    id: "cash_refb_tabs",
    title: 'Справочники',
    header: true,
    border: false,
    height: Ext.getCmp('cash_sett').getHeight()*2/3-50,
    width: Ext.getCmp('cash_sett').getWidth(),
    items: [cash_refb_cur, cash_refb_group, cash_refb_org, cash_refb_type]
});