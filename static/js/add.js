var v_edit_id = 0;
var v_copy = false;

//---- date
var cash_item_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(23),
    name: 'cash_item_date',
    id: 'cash_item_date',
    value: new Date(),
    labelWidth: 100,
    format: "Y-m-d",
    allowBlank: false,
    width: 200
}; // cash_item_date


//--------- nomen list
var cash_id_name_model = Ext.define('cash_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id',      type: 'int'},
      {name: 'name',    type: 'string'}
    ],
    idProperty: 'id'
});

var cash_item_nmcl_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  //pageSize: 10,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/nmcl_list.php',
      reader: {
        type: 'json'
      }
  },
  listeners: {
      load: function( o, records, successful, eOpts ){
        Ext.getCmp('cash_item_nmcl_cb').focus(false, 1);
      }
    }
}); //cash_item_nmcl_store

var cash_item_nmcl_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_nmcl_store,
    id: "cash_item_nmcl_cb",
    name: "cash_item_nmcl_cb",
    fieldLabel: lang(17),
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    //queryMode: 'local',
    minChars: 2,
    //typeAhead: true,
    //pageSize: true,
    width: 474,
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    listeners: {
        select: function( combo, records, e) {
          if(records != undefined && records[0].get('id') != 0) {
            cash_list_add.setLoading(lang(52));
            Ext.Ajax.request({
              url: "ajax/nmcl_param.php",
              method: "GET",
              params: {
                  nmcl_id: records[0].get('id')
              },
              success: function(data) {
                  cash_list_add.setLoading(false);
                  var obj = Ext.decode(data.responseText);

                  Ext.getCmp('cash_item_prod_type_cb').setValue(obj.grp);
                  Ext.getCmp('cash_item_org_cb').setValue(obj.org_name);
                  //Ext.getCmp('cash_item_org_cb').setValue(obj.org_id);
                  Ext.getCmp('cash_item_price').focus(false, 200);
              }//success
            }); //Ext.Ajax.request
          }
        }
    }
}); //cash_item_nmcl_cb


//---- prod type list
var cash_item_prod_type_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/prod_type_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_item_prod_type_store

var cash_item_prod_type_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_prod_type_store,
    id: "cash_item_prod_type_cb",
    name: "cash_item_prod_type_cb",
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
        Ext.getCmp('cash_item_prod_type_cb').focus(false, 1);
    }
}); //cash_item_prod_type_cb


//----price
var cash_item_price = {
    xtype: 'numberfield',
    id: "cash_item_price",
    name: "cash_item_price",
    fieldLabel: lang(20),
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    allowBlank: false,
    value: 0/*,
    baseChars: '-+0123456789,.',
    listeners: {
      change: function(o, newValue, oldValue, eOpts){
        //newValue = newValue.replace(",", ".");
        console.log(oldValue);
      }
    }*/
}; //cash_item_price

//---- currency list
var cash_item_currency_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/currency_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_item_currency_store

var cash_item_currency_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_currency_store,
    id: "cash_item_currency_cb",
    name: "cash_item_currency_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    width: 100,
    value: 1
}); //cash_item_currency_cb

//---- currency list
var cash_item_ctype_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/cashes_type_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_item_ctype_store

var cash_item_ctype_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_ctype_store,
    id: "cash_item_ctype_cb",
    name: "cash_item_ctype_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    width: 170,
    value: 1    
}); //cash_item_ctype_cb


//----qnt
var cash_item_qnt = {
    xtype: 'numberfield',
    id: "cash_item_qnt",
    name: "cash_item_qnt",
    fieldLabel: lang(53),
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    value: 1/*,
    baseChars: '-+0123456789,.'*/
};


//---- org list
var cash_item_org_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/org_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_item_org_store

var cash_item_org_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_org_store,
    id: "cash_item_org_cb",
    name: "cash_item_org_cb",
    displayField: 'name',
    valueField: 'id',
    //queryMode: 'local',
    width: 474,
    fieldLabel: lang(26),
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    labelWidth: 100
}); //cash_item_org_cb


//---- type oper list
var cash_item_toper_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  data : [
         {id: 0,    name: lang(54)},
         {id: 1,    name: lang(55)}
     ]
}); //cash_item_toper_store

var cash_item_toper_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_toper_store,
    id: "cash_item_toper_cb",
    name: "cash_item_toper_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 200,
    fieldLabel: lang(56),
    allowBlank: false,
    labelWidth: 100,
    value: 0,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    editable: false
}); //cash_item_currency_cb


//---- file
var cash_item_file = {
    xtype: 'filefield',
    id: "cash_item_file",
    name: "cash_item_file",
    fieldLabel: lang(28),
    labelWidth: 100,
    width: 474,
    buttonText: lang(57)
};


var cash_item_file_del = {
    xtype:      'checkboxfield',
    boxLabel  : lang(225),
    name      : 'cash_item_file_del',
    id        : 'cash_item_file_del',
    inputValue: 1,
    width: 74,
    hidden: true
}; //cash_item_file_del

var cash_item_file_tb = {
      xtype: 'toolbar',
      id: "cash_item_file_tb",
      ui: 'footer',
      items: [cash_item_file, cash_item_file_del]
}; //cash_item_file_tb

//---- note
var cash_item_note = {
    xtype: 'textarea',
    name: 'cash_item_note',
    id: "cash_item_note",
    fieldLabel: lang(35),
    labelWidth: 100,
    width: 474,
    height: 50
};

var cash_item_geo = Ext.create('Ext.form.field.Hidden', {
    name: 'cash_item_geo',
    id: "cash_item_geo",
    value: '0;0'
});//cash_item_geo

//---  save
var cash_item_save = Ext.create('Ext.button.Button', {
	text: lang(58),
	formBind: true,
	id: "cash_item_save",
  tooltip: lang(59) + " (Enter)",
	icon: settings.static + "/yes.gif",
	disabled: true,
	handler : function() {
	  submt_add();
	}
});

var cash_item_add = Ext.create('Ext.button.Button', {
	text: lang(49),
	formBind: true,
  tooltip: lang(60) + " (Shift-Enter)",
	id: "cash_item_add",
	icon: settings.static + "/yes.gif",
	disabled: true,
	tabIndex: -1,
	handler : function() {
	  submt_add(true);
	}
});


var cash_item_cancel = Ext.create('Ext.button.Button',
{
	text: lang(61),
  tooltip: lang(62) + " (Escape)",
	handler : function() {
	  cash_list_add.hide();
	}
});

//---price
var cash_item_price_tb = {
      xtype: 'toolbar',
      id: "cash_item_price_tb",
      items: [cash_item_price,
	      cash_item_currency_cb,
	      cash_item_ctype_cb]
}; //cash_item_price_tb

var cash_item_edit_id = Ext.create('Ext.form.field.Hidden', {
    name: 'cash_item_edit_id',
    id: "cash_item_edit_id",
    value: v_edit_id
});//cash_item_edit_id

var cash_item_edit_id_label = {
  xtype: 'label',
  id: "cash_item_edit_id_label",
  name: "cash_item_edit_id_label",
  text: '0'
}

function submt_add(_add) {
  if(Ext.getCmp('cash_item_save').isDisabled()) return;
  
  if(_add) {
    if(v_edit_id > 0) return;
	  cash_list_add.setLoading(lang(63));
  } else {
    cash_list_add.setLoading(lang(64));
  }
  var form = Ext.getCmp('cash_item_form_add').getForm();
  form.submit({
      success: function(form, action) {
          cash_list_add.setLoading(false);
          if(_add) {
            setDefault();
            listRefresh(function() {
              Ext.getCmp('cash_item_nmcl_cb').focus(false, 100);
            });
          } else {
            cash_list_add.hide();
            listRefresh();
          }
      },
      failure: function(form, action) {
          error(action.result.msg, function() {
            cash_list_add.setLoading(false);
          });
      }
  }); //form.submit
}


//---- form add
var cash_item_form_add = new Ext.FormPanel({
  url:'ajax/add.php',
  bodyPadding: 0,
  id: "cash_item_form_add",
  frame: true,
  items: [cash_item_date,
	  cash_item_nmcl_cb,
	  cash_item_prod_type_cb,
	  cash_item_price_tb,
	  cash_item_qnt,
	  cash_item_org_cb,
	  cash_item_toper_cb,
	  cash_item_file_tb,
	  cash_item_note,
	  cash_item_edit_id,
    cash_item_geo
 	 ],
  listeners: {
    afterRender: function(thisForm, options) {
        var map = new Ext.util.KeyMap({
          target: "cash_list_add",
          binding: [{
              key: Ext.EventObject.ENTER,
              fn: function(keyCode, e) { 
                if( e.shiftKey || e.target.name == "cash_item_note" ) {
                    //e.preventDefault();
                    return true;
                }
                submt_add();
                return true;
              }
            }, {
              key: Ext.EventObject.ENTER,
              shift: true,
              fn: function(keyCode, e) {
                submt_add(true);

                return false;
              }
        }]});
    }
  },
  buttons: [cash_item_edit_id_label, "->", cash_item_add, cash_item_save, " ", cash_item_cancel]
});

function setDefault() {
  Ext.getCmp('cash_item_nmcl_cb').focus(false, 200);

  //add - default value
  Ext.getCmp('cash_item_date').setValue(new Date());
  Ext.getCmp('cash_item_nmcl_cb').setValue("");
  Ext.getCmp('cash_item_prod_type_cb').setValue("");
  Ext.getCmp('cash_item_price').setValue(0);
  Ext.getCmp('cash_item_currency_cb').setValue(1);
  Ext.getCmp('cash_item_ctype_cb').setValue(1);
  Ext.getCmp('cash_item_qnt').setValue(1);
  Ext.getCmp('cash_item_org_cb').setValue("");
  Ext.getCmp('cash_item_toper_cb').setValue(0);
  //Ext.getCmp('cash_item_file_value').setText("");
  document.getElementById('cash_item_file-inputEl').value = "";
  document.getElementById('cash_item_file-inputEl').onclick = null;
  Ext.getCmp('cash_item_note').setValue("");
  Ext.getCmp('cash_item_edit_id').setValue(0);
  Ext.getCmp('cash_list_add').setTitle(lang(65));
  Ext.getCmp('cash_item_file_del').setValue(false);
  Ext.getCmp('cash_item_file_del').hide();
  Ext.getCmp('cash_item_file').setWidth(Ext.getCmp('cash_item_nmcl_cb').getWidth());
  Ext.getCmp('cash_item_geo').setValue("0;0");
}

function cash_list_add_load() {
  Ext.getCmp('cash_item_edit_id').setValue(v_edit_id);
  Ext.getCmp('cash_item_edit_id_label').setText(v_edit_id);

  if(v_edit_id == 0) {
    setDefault();
    Ext.getCmp('cash_item_add').setVisible(true);
    cash_list_add.setLoading(false);
    Ext.getCmp('cash_item_edit_id_label').setText("");
    setAnkhor();
    return;
  }

  //edit
  Ext.Ajax.request({
      url: "ajax/edit_item.php",
      method: "GET",
      params: {
        nmcl_id: v_edit_id
      },
      success: function(data) {
        var obj = Ext.decode(data.responseText);
        Ext.getCmp('cash_item_nmcl_cb').focus(false, 200);

        Ext.getCmp('cash_item_date').setValue(obj.oper_date);
        Ext.getCmp('cash_item_nmcl_cb').setValue(obj.nmcl_id);
        Ext.getCmp('cash_item_prod_type_cb').setValue(obj.group);
        Ext.getCmp('cash_item_price').setValue(obj.price);
        Ext.getCmp('cash_item_currency_cb').setValue(obj.cur_id);
        Ext.getCmp('cash_item_ctype_cb').setValue(obj.cash_type_id);
        Ext.getCmp('cash_item_qnt').setValue(obj.qnt);
        Ext.getCmp('cash_item_org_cb').setValue(obj.org_id);
        Ext.getCmp('cash_item_toper_cb').setValue(obj.type);
        //Ext.getCmp('cash_item_file_value').setText(obj.file);
        Ext.getCmp('cash_item_file_del').setValue(false);
        if(obj.file) {
          Ext.getCmp('cash_item_file_del').show();
          Ext.getCmp('cash_item_file').setWidth(cash_item_file.width - cash_item_file_del.width);
          
          document.getElementById('cash_item_file-inputEl').value = "get.php?id=" + v_edit_id;
          document.getElementById('cash_item_file-inputEl').onclick = function() {
            window.open("get.php?id=" + v_edit_id + "&xcsrf=" + settings.csrf, "_blank");
            return false;
          }
        } else {
          Ext.getCmp('cash_item_file_del').hide();
          Ext.getCmp('cash_item_file').setWidth(Ext.getCmp('cash_item_nmcl_cb').getWidth());
        }
        Ext.getCmp('cash_item_note').setValue(obj.note);
        Ext.getCmp('cash_list_add').setTitle(lang(66));

        Ext.getCmp('cash_item_add').setVisible(false);
        
        if(v_copy) {
          Ext.getCmp('cash_item_edit_id').setValue(0);
          Ext.getCmp('cash_list_add').setTitle(lang(65));
          Ext.getCmp('cash_item_add').setVisible(true);
          Ext.getCmp('cash_item_edit_id_label').setText("");
          Ext.getCmp('cash_item_date').setValue(new Date());
          document.getElementById('cash_item_file-inputEl').value = "";
          document.getElementById('cash_item_file-inputEl').onclick = null;
          Ext.getCmp('cash_item_file_del').setValue(0);
          Ext.getCmp('cash_item_file_del').hide();
          Ext.getCmp('cash_item_file').setWidth(Ext.getCmp('cash_item_nmcl_cb').getWidth());
          Ext.getCmp('cash_item_price').focus(false, 200);
          v_edit_id = 0;
        } else {
          if( parseInt(settings.secure_user) == 1 ) {
            if( obj.uid != uid ) {
              Ext.getCmp('cash_list_add').setDisabled(1);
            }            
          } 
        }
        
        setAnkhor();

        cash_list_add.setLoading(false);
      }//success
  }); //Ext.Ajax.request
}

///-----window
var cash_list_add = Ext.create('Ext.Window', {
    title: lang(65),
    id: "cash_list_add",
    width: 510,
    height: 355,
    closeAction: 'hide',
    resizable: false,
    modal: true,
    headerPosition: 'top',
    bodyPadding: 5,
    items: [cash_item_form_add],
    listeners: {
        hide: function() {
          setAnkhor();
        },
        close: function() {
          setAnkhor();
        },
        show: function(){
          Ext.getCmp('cash_list_add').setDisabled(parseInt(rights.write) == 0);
          cash_list_add.setLoading(lang(67));

          cash_item_nmcl_store.proxy.url = "ajax/nmcl_list.php?edit_id=" + v_edit_id;
          cash_item_org_store.proxy.url = "ajax/org_list.php?edit_id=" + v_edit_id;
          if(v_edit_id == 0) {
            cash_item_geo.setValue("0;0");
            getLocation(function(lat, lon) {
              cash_item_geo.setValue(lat+";"+lon);
            }); //getLocation
            //cash_item_nmcl_store.load(function() {
              cash_item_prod_type_store.load(function() {
                cash_item_currency_store.load(function() {
                  cash_item_ctype_store.load(function() {
                    //cash_item_org_store.load(function() {
                      cash_list_add_load();
                    //});
                  });
                });
              });
            //});
          } else {
            cash_item_nmcl_store.load(function() {
              cash_item_prod_type_store.load(function() {
                cash_item_currency_store.load(function() {
                  cash_item_ctype_store.load(function() {
                    cash_item_org_store.load(function() {
                      cash_item_geo.setValue("0;0");
                      cash_list_add_load();
                    });
                  });
                });
              });
            });
          }
        }
    }
}); //cash_list_add