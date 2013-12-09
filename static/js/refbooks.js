var h = Ext.getCmp('cash_sett').getHeight()*2/3-50;

var cash_refb_cur_model = Ext.define('cash_refb_cur_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		type: 'int'},
      {name: 'name', 		type: 'string'},
      {name: 'rate', 		type: 'double'},
      {name: 'sign', 		type: 'string'},
      {name: 'short_name',	type: 'string'}
    ],
    idProperty: 'id'
});

var cash_refb_cur_store = Ext.create('Ext.data.Store', {
    model: 'cash_refb_cur_model',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'ajax/currency_list.php'
    }
}); //cash_refb_cur_store

var cash_refb_cur_grid = Ext.create('Ext.grid.Panel', {
    store: cash_refb_cur_store,
    id: "cash_refb_cur_grid",
    forceFit: true,
    height: h-60,
    columns: [
      {text: "ID", 	            dataIndex: 'id' },
      {text: "Валюта", 	        dataIndex: 'name', 	flex: 1},
      {text: "Курс к основной", dataIndex: 'rate',  tdCls: 'x-price-cell'},
      {text: "Знак", 	          dataIndex: 'sign'  },
      {text: "Краткое имя", 	  dataIndex: 'short_name'  }
    ],
    listeners: {
      viewready: function() {
        cash_refb_cur_store.load();
      }
    }
}); //cash_refb_cur_grid
var cash_refb_cur_load_mask = new Ext.LoadMask(cash_refb_cur_grid, {msg:'Загрузка списка валют...', store: cash_refb_cur_store});


//---
var cash_refb_ptype_model = Ext.define('cash_refb_ptype_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		type: 'int'},
      {name: 'name', 		type: 'string'},
      {name: 'pid', 		type: 'int'}
    ],
    idProperty: 'id'
});

var cash_refb_ptype_store = Ext.create('Ext.data.Store', {
    model: 'cash_refb_ptype_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/prod_type_list.php'
    }
}); //cash_refb_ptype_store

var cash_refb_ptype_grid = Ext.create('Ext.grid.Panel', {
    store: cash_refb_ptype_store,
    id: "cash_refb_ptype_grid",
    height: h-60,
    forceFit: true,
    columns: [
      {text: "ID", 	dataIndex: 'id' },
      {text: "Группа", 	dataIndex: 'name', 	flex: 1},
      {text: "Родительская группа", 	dataIndex: 'pid'}
    ]
}); //cash_refb_ptype_grid
var cash_refb_ptype_mask = new Ext.LoadMask(cash_refb_ptype_grid, {msg:'Загрузка списка валют...', store: cash_refb_ptype_store});

//---

var cash_refb_org_model = Ext.define('cash_refb_org_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		  type: 'int'},
      {name: 'name', 		type: 'string'},
      {name: 'pid', 		type: 'int'},
      {name: 'city', 		type: 'string'}
    ],
    idProperty: 'id'
});

var cash_refb_org_store = Ext.create('Ext.data.Store', {
    model: 'cash_refb_org_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/org_list_flat.php'
    }
}); //cash_refb_ptype_store

var cash_refb_org_grid = Ext.create('Ext.grid.Panel', {
    store: cash_refb_org_store,
    id: "cash_refb_org_grid",
    height: h-60,
    forceFit: true,
    columns: [
      {text: "ID", 	          dataIndex: 'id' },
      {text: "Организация", 	dataIndex: 'name', 	flex: 1},
      {text: "Родительская организация", 	dataIndex: 'pid'},
      {text: "Город", 	      dataIndex: 'city'}
    ]
}); //cash_refb_org_grid
var cash_refb_org_mask = new Ext.LoadMask(cash_refb_org_grid, {msg:'Загрузка списка организаций...', store: cash_refb_org_store});


//---

var cash_refb_type_model = Ext.define('cash_refb_type_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		type: 'int'},
      {name: 'name', 		type: 'string'},
      {name: 'pid', 		type: 'int'}
    ],
    idProperty: 'id'
});

var cash_refb_type_store = Ext.create('Ext.data.Store', {
    model: 'cash_refb_type_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/cashes_type_list.php'
    }
}); //cash_refb_ptype_store

var cash_refb_type_grid = Ext.create('Ext.grid.Panel', {
    store: cash_refb_type_store,
    id: "cash_refb_type_grid",
    height: h-60,
    forceFit: true,
    columns: [
      {text: "ID", 	dataIndex: 'id' },
      {text: "Кошелек", 	dataIndex: 'name', 	flex: 1},
      {text: "Родительский кошелек", 	dataIndex: 'pid'}
    ]
}); //cash_refb_type_grid
var cash_refb_type_mask = new Ext.LoadMask(cash_refb_type_grid, {msg:'Загрузка списка организаций...', store: cash_refb_type_store});


//---

var cash_refb_nmcl_model = Ext.define('cash_refb_nmcl_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		type: 'int'},
      {name: 'name', 		type: 'string'}
    ],
    idProperty: 'id'
});

var cash_refb_nmcl_store = Ext.create('Ext.data.Store', {
    model: 'cash_refb_nmcl_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/nmcl_list_flat.php'
    }
}); //cash_refb_ptype_store

var cash_refb_nmcl_grid = Ext.create('Ext.grid.Panel', {
    store: cash_refb_nmcl_store,
    id: "cash_refb_nmcl_grid",
    height: h-60,
    forceFit: true,
    columns: [
      {text: "ID", 	dataIndex: 'id' },
      {text: "Номенклатура", 	dataIndex: 'name', 	flex: 1}
    ]
}); //cash_refb_nmcl_grid
var cash_refb_nmcl_mask = new Ext.LoadMask(cash_refb_nmcl_grid, {msg:'Загрузка списка номенклатур...', store: cash_refb_nmcl_store});


//------------------------

var cash_refb_group = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_group",
    collapsible: false,
    title: 'Группы товара',
    header: true,
    items: [cash_refb_ptype_grid],
    listeners: {
      activate: function(tab){
        cash_refb_ptype_store.load();
      }
    }

});//cash_refb_group

var cash_refb_cur = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_cur",
    collapsible: false,
    title: 'Валюты',
    header: true,
    items: [cash_refb_cur_grid],
    listeners: {
      activate: function(tab){
        cash_refb_cur_store.load();
      }
    }

});//cash_refb_cur

var cash_refb_org = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_org",
    collapsible: false,
    title: 'Организации',
    header: true,
    items: [cash_refb_org_grid],
    listeners: {
      activate: function(tab){
        cash_refb_org_store.load();
      }
    }

});//cash_refb_org

var cash_refb_type = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_type",
    collapsible: false,
    title: 'Кошельки',
    header: true,
    items: [cash_refb_type_grid],
    listeners: {
      activate: function(tab){
        cash_refb_type_store.load();
      }
    }

});//cash_refb_type


var cash_refb_nmcl = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_nmcl",
    collapsible: false,
    title: 'Номенклатуры',
    header: true,
    items: [cash_refb_nmcl_grid],
    listeners: {
      activate: function(tab){
        cash_refb_nmcl_store.load();
      }
    }

});//cash_refb_nmcl



var cash_refb_tabs = Ext.widget('tabpanel', {
    id: "cash_refb_tabs",
    title: 'Справочники',
    header: true,
    border: false,
    height: h,
    width: Ext.getCmp('cash_sett').getWidth() - 20,
    items: [cash_refb_cur, cash_refb_group, cash_refb_org, cash_refb_type, cash_refb_nmcl]
});