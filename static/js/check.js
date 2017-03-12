var v_edit_id = 0;
var v_hash = '';
var v_fpd = false;

var cash_check_fpd = {
    xtype: 'textfield',
    id: "cash_check_fpd",
    name: "cash_check_fpd",
    fieldLabel: lang(239),
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    value: ""
}; //cash_check_fpd

var cash_check_fpd_load = Ext.create('Ext.button.Button',
{
  text: lang(241),
  tooltip: lang(241),
  cls: "x-btn-default-small",
  handler : function() {
    cash_list_check.setLoading(true);
    
    cash_list_check_clear();
    
    Ext.Ajax.request({
      url: "ajax/fpd_check.php?type=head&fpd=" + Ext.getCmp('cash_check_fpd').getValue(),
      method: "GET",
      success: function(data) {          
          if(data.responseText == "") {
            error(lang(15));
            cash_list_check.setLoading(false);
            return;
          }
          
          var obj = Ext.decode(data.responseText);
          
          if(obj.error) {
            error(obj.text);
            cash_list_check.setLoading(false);
            return;
          }

          Ext.getCmp('cash_check_org_cb').setValue(obj.org);
          Ext.getCmp('cash_check_date').setValue(Ext.Date.parse(obj.date, "d.m.Y H:i"));
          if(obj.sum_card > 0) {
            Ext.getCmp('cash_check_ctype_cb').setValue(2);
          } else {
            Ext.getCmp('cash_check_ctype_cb').setValue(1);
          }
          Ext.getCmp('cash_check_prod_type_cb').setValue(1);
          
          cash_check_store.proxy.url = 'ajax/fpd_check.php?type=body&fpd=' + Ext.getCmp('cash_check_fpd').getValue();
          cash_check_store.load(function() {
            cash_list_check.setLoading(false);
          });
      }//success
    }); //Ext.Ajax.request
  }
});//cash_check_fpd_load

var cash_check_cancel = Ext.create('Ext.button.Button',
{
  text: lang(61),
  tooltip: lang(62) + " (Escape)",
  handler : function() {
	  cash_list_check.hide();
	}
});//cash_check_cancel

//---- date
var cash_check_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(23),
    name: 'cash_check_date',
    id: 'cash_check_date',
    value: new Date(),
    labelWidth: 100,
    format: settings.date_format,
    allowBlank: false,
    width: 200,
    submitFormat: "Y-m-d"
}; // cash_check_date

var cash_check_id_name_model = Ext.define('cash_check_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id',      type: 'INT'},
      {name: 'name',    type: 'text'}
    ],
    idProperty: 'id'
});

var cash_check_org_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/org_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_org_store

var cash_check_org_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_org_store,
    id: "cash_check_org_cb",
    name: "cash_check_org_cb",
    displayField: 'name',
    valueField: 'id',
    width: 474,
    fieldLabel: lang(26),
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    labelWidth: 100
}); //cash_check_org_cb

//---- prod type list
var cash_check_prod_type_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/prod_type_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_prod_type_store

var cash_check_prod_type_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_prod_type_store,
    id: "cash_check_prod_type_cb",
    name: "cash_check_prod_type_cb",
    fieldLabel: lang(19),
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    width: 474,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
        Ext.getCmp('cash_check_prod_type_cb').focus(false, 1);
    }
}); //cash_check_prod_type_cb

//---- currency list
var cash_check_currency_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/currency_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_currency_store

var cash_check_currency_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_currency_store,
    id: "cash_check_currency_cb",
    name: "cash_check_currency_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    fieldLabel: lang(74),
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    value: 1
}); //cash_check_currency_cb

//---- currency list
var cash_check_ctype_store = Ext.create('Ext.data.Store', {
  model: 'cash_check_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/cashes_type_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_check_ctype_store

var cash_check_ctype_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_check_ctype_store,
    id: "cash_check_ctype_cb",
    name: "cash_check_ctype_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    width: 170,
    value: 1
}); //cash_check_ctype_cb

//---price
var cash_check_price_tb = {
      xtype: 'toolbar',
      id: "cash_check_price_tb",
      items: [cash_check_currency_cb, cash_check_ctype_cb]
}; //cash_check_price_tb

var cash_check_geo = Ext.create('Ext.form.field.Hidden', {
    name: 'cash_check_geo',
    id: "cash_check_geo",
    value: '0;0'
});//cash_check_geo

//lines
var cash_check_model = Ext.define('cash_check_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'name', 	type: 'string'},
      //{name: 'gr_id', 	type: 'int'},
      //{name: 'gr_name', type: 'string'},
      {name: 'price', 	type: 'double'},
      {name: 'qnt', 	type: 'double'},
      {name: 'amnt', 	type: 'double'}
    ],
    idProperty: 'name'
});

var cash_check_store = Ext.create('Ext.data.Store', {
    model: 'cash_check_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/check.php?type=body&hash=' + v_hash
    }
}); //cash_check_model

var cash_check_grid = Ext.create('Ext.grid.Panel', {
    store: cash_check_store,
    height: 390,
    columns: [
      {text: lang(17), dataIndex: 'name',     flex: 1, 	hideable: false, editor: {xtype: 'textfield', allowBlank: false} },
      //{text: lang(18), dataIndex: 'gr_id', 	  hidden: true , 	tdCls: 'x-center-cell'},
      //{text: lang(19), dataIndex: 'gr_name',  hideable: false, editor: {xtype: 'textfield', allowBlank: false} },
      {text: lang(20), dataIndex: 'price',    hideable: false, renderer: price, tdCls: 'x-price-cell', editor: {xtype: 'textfield', allowBlank: false} },
      {text: lang(21), dataIndex: 'qnt',      hideable: false, tdCls: 'x-center-cell', editor: {xtype: 'textfield', allowBlank: false} },
      {text: lang(22), dataIndex: 'amnt',		  hideable: false, summaryType: 'sum' , tdCls: 'x-amount-cell' 
            , summaryRenderer: function(value) {
              var total = 0;
              cash_check_store.each(function(rec) {
                total += rec.get('qnt') * rec.get('price')
              });
              return price_r(total);
            }
            ,renderer : function(value, metaData, record, rowIdx, colIdx, store, view) {
              return price_r( record.get('qnt') * record.get('price') );
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

var loadMask_cash_check_grid = new Ext.LoadMask(cash_check_grid, {msg:'Загрузка списка операций...', store: cash_check_store});

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
    //check if FPD already exists
    Ext.Ajax.request({
      url: "ajax/check_fpd.php?fpd=" + Ext.getCmp('cash_check_fpd').getValue(),
      method: "GET",
      success: function(data) {
        var obj = Ext.decode(data.responseText);
        if(obj.fpd == 1) {
          Ext.Msg.show({
            title:lang(239),
            msg: lang(243),
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.OKCANCEL,
            fn: function(buttonId) {
              //if clicked ok
              if(buttonId == "ok") {
                  cash_check_save_hdlr();
              } //buttonId == "ok"
            } // fn - button click
          });//Ext.Msg.show
        } else { //obj.fpd
          cash_check_save_hdlr();
        }
      }//success
    }); //Ext.Ajax.request
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

var cash_check_fpd_tb = {
      xtype: 'toolbar',
      id: "cash_check_fpd_tb",
      items: [cash_check_fpd,cash_check_fpd_load]
}; //cash_check_fpd_tb

//---- form add
var cash_check_form_add = new Ext.FormPanel({
  url:'ajax/add_check.php',
  bodyPadding: 0,
  id: "cash_check_form_add",
  frame: true,
  border: false,
  items: [cash_check_fpd_tb, cash_check_date, cash_check_org_cb, cash_check_prod_type_cb, cash_check_price_tb, 
    { xtype: 'hiddenfield', id: 'cash_check_grid_hdn', name: 'cash_check_grid_hdn' }, cash_check_grid, cash_check_geo ],
  buttons: ["->", cash_check_save, " ", cash_check_cancel]
}); //cash_check_form_add

function cash_list_check_clear() {
  Ext.getCmp('cash_check_fpd_tb').show();
  cash_check_store.removeAll();
  Ext.getCmp('cash_check_org_cb').setValue("");
  Ext.getCmp('cash_check_date').setValue("");
  Ext.getCmp('cash_check_ctype_cb').setValue(1);
  Ext.getCmp('cash_check_prod_type_cb').setValue(1);
} //cash_list_check_clear

var cash_list_check = Ext.create('Ext.Window', {
    title: lang(76),
    id: "cash_list_add_check",
    width: 800,
    height: 600,
    closeAction: 'hide',
    modal: true,
    headerPosition: 'top',
    bodyPadding: 5,
    items: [cash_check_form_add],
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
          
          //cash_check_nmcl_store.load(function() {
            cash_check_prod_type_store.load(function() {
              cash_check_currency_store.load(function() {
                cash_check_ctype_store.load(function() {
                  
                  if(v_fpd) {
                    cash_list_check_clear();
                    Ext.getCmp('cash_check_fpd').setValue("");
                    Ext.getCmp('cash_check_fpd').focus(false, 200);                    
                    cash_list_check.setLoading(false);
                  } else {
                    
                    Ext.getCmp('cash_check_fpd_tb').hide();
                
                    cash_check_store.proxy.url = 'ajax/ocr_check.php?type=body&hash=' + v_hash;
                    cash_check_store.load(function() {
                      cash_check_currency_cb.setValue(parseInt(settings.currency));
                      Ext.Ajax.request({
                        url: "ajax/ocr_check.php?type=head&hash=" + v_hash,
                        method: "GET",
                        success: function(data) {
                            var obj = Ext.decode(data.responseText);

                            Ext.getCmp('cash_check_org_cb').setValue(obj.org);
                            Ext.getCmp('cash_check_date').setValue(Ext.Date.parse(obj.date, "d.m.Y"));
                            
                            cash_list_check.setLoading(false);
                        }//success
                      }); //Ext.Ajax.request
                    });
                  } //v_fpd
                });
              });
            });
          //});          
        }
    }
}); //cash_list_check
