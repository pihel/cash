var cash_check_store = Ext.create('Ext.data.ArrayStore', {
	fields: [
	  {name: 'nmcl_id', type: 'int'},
      {name: 'nm_name', type: 'string'},
      {name: 'grp_id', 	type: 'int'},
      {name: 'gr_name', type: 'string'},
	  {name: 'org_id', 	type: 'int'},
      {name: 'org', 	type: 'string'},
	  {name: 'oper_date', type: 'date', dateFormat: "Y-m-d"},
      {name: 'amount', 	type: 'double'}
    ]
}); //cash_check_store

var cash_check_xls_load = Ext.create('Ext.button.Button',
{
  text: lang(241),
  tooltip: lang(241),
  cls: "x-btn-default-small",
  id: "cash_check_xls_load",
  handler : function() {
    cash_list_check.setLoading(true);
	cash_list_check_clear();
	
	cash_check_form_file.submit({
        waitTitle: lang(4),
        waitMsg: lang(39),
        success: function(form, action) {
          cash_list_check.setLoading(false);
		  cash_check_grid.getStore().loadData(action.result.data);
		  Ext.getCmp('cash_check_save').setDisabled(0);
        },
        failure: function(form, action) {
		  cash_list_check.setLoading(false);
          error(action.result.msg);
        }
    }); //cash_check_form_file
	
	cash_list_check_clear();
  }
});//cash_check_xls_load

var cash_check_cancel = Ext.create('Ext.button.Button',
{
  text: lang(61),
  tooltip: lang(62) + " (Escape)",
  handler : function() {
	  cash_list_check.hide();
	}
});//cash_check_cancel


var cash_check_file = {
    xtype: 'filefield',
    id: "cash_check_file",
    name: "cash_check_file",
    fieldLabel: lang(239),
    labelWidth: 100,
    width: 474,
    buttonText: lang(57),
	listeners: {
        change: function() {
          Ext.getCmp('cash_check_xls_load').setDisabled(0);
        }
	}
};


var cash_check_geo = Ext.create('Ext.form.field.Hidden', {
    name: 'cash_check_geo',
    id: "cash_check_geo",
    value: '0;0'
});//cash_check_geo

var cash_check_id_name_model = Ext.define('cash_check_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id',      type: 'int'},
      {name: 'name',    type: 'string'}
    ],
    idProperty: 'id'
});

var cash_check_nmcl_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  //pageSize: 10,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/nmcl_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_nmcl_store

var cash_check_nmcl_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_nmcl_store,
    id: "cash_check_nmcl_cb",
    name: "cash_check_nmcl_cb",
    labelWidth: 100,
    displayField: 'name',
    valueField: 'name',
    minChars: 2,
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>'
}); //cash_check_nmcl_cb

var cash_check_org_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  //pageSize: 10,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/org_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_nmcl_store

var cash_check_org_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_org_store,
    id: "cash_check_org_cb",
    name: "cash_check_org_cb",
    labelWidth: 100,
    displayField: 'name',
    valueField: 'name',
    minChars: 2,
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>'
}); //cash_check_org_cb

var cash_check_gr_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  //pageSize: 10,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/prod_type_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_nmcl_store

var cash_check_gr_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_gr_store,
    id: "cash_check_gr_cb",
    name: "cash_check_gr_cb",
    labelWidth: 100,
    displayField: 'name',
    valueField: 'name',
    minChars: 2,
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>'
}); //cash_check_gr_cb


var cash_check_grid = Ext.create('Ext.grid.Panel', {
    store: cash_check_store,
    height: 540,
    columns: [
	  {text: lang(16), dataIndex: 'nmcl_id', hidden: true , 	tdCls: 'x-center-cell'},
      {text: lang(17), dataIndex: 'nm_name', flex: 1, editor: cash_check_nmcl_cb},
      {text: lang(18), dataIndex: 'grp_id',  hidden: true , 	tdCls: 'x-center-cell'},
      {text: lang(19), dataIndex: 'gr_name',  hideable: false, editor: cash_check_gr_cb },
	  {text: lang(25), dataIndex: 'org_id',   hidden: true, 	tdCls: 'x-center-cell' },
      {text: lang(26), dataIndex: 'org',	  flex: 1, hideable: false, editor: cash_check_org_cb },
	  {text: lang(23), dataIndex: 'oper_date',	  hideable: false, renderer: dateRender, tdCls: 'x-center-cell', editor: {xtype: 'datefield', allowBlank: false}  },
      {text: lang(22), dataIndex: 'amount',	  hideable: false, summaryType: 'sum' , tdCls: 'x-amount-cell' , editor: {xtype: 'numberfield', allowBlank: false}
            , summaryRenderer: function(value) {
              var total = 0;
              cash_check_store.each(function(rec) {
                total += rec.get('amount');
              });
              return price_r(total);
            }
            ,renderer : function(value, metaData, record, rowIdx, colIdx, store, view) {
              return price_r( record.get('amount') );
            } 
      },
      {
            menuDisabled: true,
            sortable: false,
            draggable: false,
            hideable: false,
            xtype: 'actioncolumn',
            width: 35,
            id: "cash_check_edit_col",
            items: [ {
              iconCls: 'del-cash-col',
              tooltip: lang(37),
              handler: function(grid, rowIndex, colIndex) {
                  var rec = grid.getStore().getAt(rowIndex);
                  grid.getStore().remove(rec);
              }
            }]
        }
    ],
    listeners: {
      cellkeydown: function( obj, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var key = e.getKey();
        if(key == Ext.EventObject.DELETE) {
          cash_check_grid.getStore().remove(cash_check_grid.getStore().getAt(rowIndex));
        }
      }
    },
    features: [{
        ftype: 'summary'
    }],
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    region:'center'
}); //cash_check_grid

var loadMask_cash_check_grid = new Ext.LoadMask(cash_check_grid, {msg:lang(39), store: cash_check_store});

function cash_check_save_hdlr() {  
    //save grid data to hidden
    var cash_check_grid_lines = cash_check_grid.store.getRange();
    var cash_check_grid_lines_arr = new Array();
    Ext.each(cash_check_grid_lines, function(record){
      cash_check_grid_lines_arr.push(record.data);
    });
    Ext.getCmp('cash_check_grid_hdn').setValue(Ext.JSON.encode(cash_check_grid_lines_arr));
    
    cash_check_form_add.submit({
        waitTitle: lang(4),
        waitMsg: lang(75),
        success: function(form, action) {
          cash_list_check.hide();
          listRefresh();
        },
        failure: function(form, action) {
          error(action.result.msg);
        }
    }); //cash_check_form_add
}

//---  save
var cash_check_save = Ext.create('Ext.button.Button', {
  text: 'Сохранить',
  formBind: true,
  id: "cash_check_save",
  tooltip: lang(59),
  icon: settings.static + "/yes.gif",
  disabled: true,
  handler : function() {
	cash_check_save_hdlr();
  }
});


var cash_check_cancel = Ext.create('Ext.button.Button',
{
  text: lang(61),
  tooltip: lang(62) + " (Escape)",
  handler : function() {
    cash_list_check.hide();
  }
});//cash_check_cancel

var cash_check_file_tb = {
      xtype: 'toolbar',
      id: "cash_check_file_tb",
      ui: 'footer',
      items: [cash_check_file, "->", cash_check_xls_load]
}; //cash_check_file_tb


//---- form add
var cash_check_form_file = new Ext.FormPanel({
  url:'ajax/add_check_file.php',
  bodyPadding: 0,
  id: "cash_check_form_file",
  frame: true,
  border: false,
  items: [cash_check_file_tb ]
}); //cash_check_form_file

var cash_check_form_add = new Ext.FormPanel({
  url:'ajax/add_check.php',
  bodyPadding: 0,
  id: "cash_check_form_add",
  frame: true,
  border: false,
  items: [{ xtype: 'hiddenfield', id: 'cash_check_grid_hdn', name: 'cash_check_grid_hdn' }, cash_check_grid, cash_check_geo ],
  buttons: ["->", cash_check_save, " ", cash_check_cancel]
}); //cash_check_form_add

function cash_list_check_clear() {
  if(cash_check_store.data.getCount() > 0) cash_check_store.removeAll();
  Ext.getCmp('cash_check_file').setValue("");
  if(Ext.getCmp('cash_check_save')) Ext.getCmp('cash_check_save').setDisabled(1);
  if(Ext.getCmp('cash_check_xls_load'))  Ext.getCmp('cash_check_xls_load').setDisabled(1);
} //cash_list_check_clear

var cash_list_check = Ext.create('Ext.Window', {
    title: lang(240),
    id: "cash_list_add_check",
    width: 1000,
    height: 650,
    closeAction: 'hide',
    modal: true,
    headerPosition: 'top',
    bodyPadding: 5,
    items: [cash_check_form_file, cash_check_form_add],
    listeners: {
        hide: function() {
          setAnkhor();
        },
        close: function() {
          setAnkhor();
        },
        show: function() {
			cash_list_check.setLoading(lang(67));

			getLocation(function(lat, lon) {
				cash_check_geo.setValue(lat+";"+lon);
			}); //getLocation
			
			cash_list_check_clear();
			
			cash_list_check.setLoading(false);
        }
    }
}); //cash_list_check
