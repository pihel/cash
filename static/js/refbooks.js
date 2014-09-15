var h = Ext.getCmp('cash_sett').getHeight()*2/3-50;

var cash_refb_settings_model = Ext.define('cash_refb_settings_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'name', 		  type: 'string'},
      {name: 'descr', 		type: 'string'},
      {name: 'value', 		type: 'string'}
    ],
    idProperty: 'name'
});

var cash_refb_settings = Ext.create('Ext.data.Store', {
    model: 'cash_refb_settings_model',
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: 'ajax/settings_flat.php'
    }
}); //cash_refb_settings

var colSave = {
    menuDisabled: true,
    sortable: false,
    hideable: false,
    xtype: 'actioncolumn',
    width: 30,
    refbook: "",
    items: [ {
      icon: settings.static + "/yes.gif",
      tooltip: lang(79),
      handler: function(grid, rowIndex, colIndex) {
        if(parseInt(rights.write) == 0) return;

        var rec = grid.getStore().getAt(rowIndex);
        
        Ext.Ajax.request({
          url: "ajax/save_refbook.php?refb=" + this.refbook + "&indx=" + rec.internalId,
          method: "POST",
          params: rec.data,
          success: function(data) {
              if(parseInt(data.responseText) > 0) {
                grid.getStore().load();
              } else {
                error(data.responseText);
              }
          }//success
        }); //Ext.Ajax.request
      }
    }]
};

function getColSave(refb) {
  //if(settings.demo == 1) return {hidden: true, sortable: false, hideable: false, xtype: 'actioncolumn'};
  colSave.refbook = refb;
  return colSave;
}

function getPluginSave() {
  //if(settings.demo == 1) return [];
  return [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit:  1
        })];
}

var cash_refb_set_grid = Ext.create('Ext.grid.Panel', {
    store: cash_refb_settings,
    id: "cash_refb_set_grid",
    forceFit: true,
    height: h-95,
    columns: [
      {text: lang(138), dataIndex: 'name', 	width: 300 },
      {text: lang(139), dataIndex: 'descr', width: 400 },
      {text: lang(140), dataIndex: 'value', flex: 1, editor: {allowBlank: false}, renderer: htmlRenderer}
      ,getColSave("cashes_setting")
    ],
    listeners: {
      viewready: function() {
        cash_refb_settings.load();
      }
    },
    autoEncode: true,
    selType: 'cellmodel',
    plugins: getPluginSave()
}); //cash_refb_set_grid
var cash_refb_set_grid_load_mask = new Ext.LoadMask(cash_refb_set_grid, {msg:'Загрузка списка настроек...', store: cash_refb_settings});

var cash_refb_cur_model = Ext.define('cash_refb_cur_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		      type: 'int'},
      {name: 'name', 		    type: 'string'},
      {name: 'rate', 		    type: 'number'},
      {name: 'sign', 		    type: 'string'},
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
    forceFit: false,
    height: h-60,
    columns: [
      {text: "ID", 	    dataIndex: 'id' },
      {text: lang(74), 	dataIndex: 'name', 	flex: 1, editor: {allowBlank: false}, renderer: htmlRenderer},
      {text: lang(141), dataIndex: 'rate',  tdCls: 'x-price-cell', editor: {allowBlank: false}},
      {text: lang(32), 	dataIndex: 'sign'  , editor: {allowBlank: false}, renderer: htmlRenderer},
      {text: lang(142), dataIndex: 'short_name', editor: {allowBlank: false} , renderer: htmlRenderer }
      ,getColSave("currency")
    ],
    selType: 'cellmodel',
    plugins: getPluginSave()
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
      {text: "ID", 	    dataIndex: 'id' },
      {text: lang(19), 	dataIndex: 'name', 	flex: 1, editor: {allowBlank: false}, renderer: htmlRenderer},
      {text: lang(143), dataIndex: 'pid', editor: {allowBlank: false}}
      ,getColSave("cashes_group")
    ],
    selType: 'cellmodel',
    plugins: getPluginSave()
}); //cash_refb_ptype_grid
var cash_refb_ptype_mask = new Ext.LoadMask(cash_refb_ptype_grid, {msg:'Загрузка списка групп...', store: cash_refb_ptype_store});

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
      {text: "ID", 	    dataIndex: 'id' },
      {text: lang(26), 	dataIndex: 'name', 	flex: 1, editor: {allowBlank: false}, renderer: htmlRenderer},
      {text: lang(145), dataIndex: 'pid', editor: {allowBlank: false}},
      {text: lang(144), dataIndex: 'city', editor: {allowBlank: false}, renderer: htmlRenderer}
      ,getColSave("cashes_org")
    ],
    selType: 'cellmodel',
    plugins: getPluginSave()
}); //cash_refb_org_grid
var cash_refb_org_mask = new Ext.LoadMask(cash_refb_org_grid, {msg:'Загрузка списка организаций...', store: cash_refb_org_store});


//---

var cash_refb_type_model = Ext.define('cash_refb_type_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		  type: 'int'},
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
      {text: lang(34), 	dataIndex: 'name', 	flex: 1, editor: {allowBlank: false}, renderer: htmlRenderer},
      {text: lang(146), dataIndex: 'pid', editor: {allowBlank: false}}
      ,getColSave("cashes_type")
    ],
    selType: 'cellmodel',
    plugins: getPluginSave()
}); //cash_refb_type_grid
var cash_refb_type_mask = new Ext.LoadMask(cash_refb_type_grid, {msg:'Загрузка списка кошельков...', store: cash_refb_type_store});


//---

var cash_refb_nmcl_model = Ext.define('cash_refb_nmcl_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		type: 'int'},
      {name: 'name', 	type: 'string'}
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
      {text: lang(17), 	dataIndex: 'name', 	flex: 1, editor: {allowBlank: false}, renderer: htmlRenderer}
      ,getColSave("cashes_nom")
    ],
    selType: 'cellmodel',
    plugins: getPluginSave()
}); //cash_refb_nmcl_grid
var cash_refb_nmcl_mask = new Ext.LoadMask(cash_refb_nmcl_grid, {msg:'Загрузка списка номенклатур...', store: cash_refb_nmcl_store});


//------------------------

var cash_refb_dwnl_btn = {
  id: "cash_refb_dwnl_btn",
  xtype: 'button',
  text: lang(147),
  tooltip: lang(148),
  border: true,
  icon: settings.static + "/files.gif",
  handler : function(){
    window.open("get.php?id=-1&xcsrf="+settings.csrf);
    return false;
  }
}

var cash_refb_analize_btn = {
  xtype: 'button',
  text: lang(149),
  tooltip: lang(150),
  border: true,
  icon: settings.static + "/yes.gif",
  handler : function(){
    Ext.Ajax.request({
      url: "ajax/analize.php",
      method: "GET",
      success: function(data) {
          if(parseInt(data.responseText) > 0) {
            Ext.MessageBox.alert(lang(152), lang(151));
          } else {
            error(data.responseText);
          }
      }//success
    }); //Ext.Ajax.request
    return false;
  }
}

var cash_refb_dwnl = Ext.create('Ext.Panel', {
    frame: true,
    collapsible: false,
    items: [cash_refb_dwnl_btn, cash_refb_analize_btn]

});//cash_refb_set


var cash_refb_set = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_set",
    collapsible: false,
    title: lang(10),
    header: true,
    items: [cash_refb_set_grid, cash_refb_dwnl],
    listeners: {
      activate: function(tab){
        cash_refb_settings.load();
      }
    }

});//cash_refb_set

var cash_refb_group = Ext.create('Ext.Panel', {
    frame: true,
    id: "cash_refb_group",
    collapsible: false,
    title: lang(153),
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
    title: lang(154),
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
    title: lang(155),
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
    title: lang(156),
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
    title: lang(157),
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
    title: lang(158),
    header: true,
    border: false,
    height: h,
    width: Ext.getCmp('cash_sett').getWidth() - 20,
    items: [cash_refb_set, cash_refb_cur, cash_refb_group, cash_refb_org, cash_refb_type, cash_refb_nmcl]
});