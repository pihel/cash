
//дублирование кода с add.js ....
var cash_item_nmcl_cb_fltr = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_nmcl_store,
    id: "cash_item_nmcl_cb_fltr",
    name: "cash_item_nmcl_cb_fltr",
    fieldLabel: lang(17),
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    //queryMode: 'local',
    minChars: 2,
    //typeAhead: true,
    //pageSize: true,
    width: 474,
    listeners: {
      select: function( combo, records, e) {
        if(records != undefined && records[0].get('id') != 0) {
          Ext.getCmp('cash_list_tb_filter_bgrp').setLoading(lang(52));
          Ext.Ajax.request({
            url: "ajax/nmcl_param.php",
            method: "GET",
            params: {
                nmcl_id: records[0].get('id')
            },
            success: function(data) {
                Ext.getCmp('cash_list_tb_filter_bgrp').setLoading(false);
                var obj = Ext.decode(data.responseText);

                Ext.getCmp('cash_item_prod_type_cb_fltr').setValue(obj.grp);
                Ext.getCmp('cash_item_org_fltr_cb').setValue(obj.org_name);
            }//success
          }); //Ext.Ajax.request
        }
      }
    }
}); //cash_item_nmcl_cb_fltr

var cash_item_nmcl_cb_fltr_no = {
    xtype:      'checkboxfield',
    boxLabel  : lang(68),
    name      : 'cash_item_nmcl_cb_fltr_no',
    inputValue: '0',
    id        : 'cash_item_nmcl_cb_fltr_no'
}; //cash_item_nmcl_cb_fltr_no


var cash_item_prod_type_cb_fltr = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_prod_type_store,
    id: "cash_item_prod_type_cb_fltr",
    name: "cash_item_prod_type_cb_fltr",
    fieldLabel: lang(19),
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 474,
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
    }
}); //cash_item_prod_type_cb_fltr

var cash_item_prod_type_cb_fltr_no = {
    xtype:      'checkboxfield',
    boxLabel  : lang(68),
    name      : 'cash_item_prod_type_cb_fltr_no',
    inputValue: '0',
    id        : 'cash_item_prod_type_cb_fltr_no'
}; //cash_item_prod_type_cb_fltr_no

var cash_item_price_frm_fltr = {
    xtype: 'numberfield',
    id: "cash_item_price_frm_fltr",
    name: "cash_item_price_frm_fltr",
    fieldLabel: lang(20),
    labelWidth: 100,
    width: 200
}; //cash_item_price_frm_fltr

var cash_item_price_to_fltr = {
    xtype: 'numberfield',
    id: "cash_item_price_to_fltr",
    name: "cash_item_price_to_fltr",
    fieldLabel: lang(44),
    labelWidth: 20,
    width: 120
}; //cash_item_price_to_fltr

var cash_item_currency_fltr_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_currency_store,
    id: "cash_item_currency_fltr_cb",
    name: "cash_item_currency_fltr_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 100,
    editable: false
}); //cash_item_currency_cb

var cash_item_ctype_fltr_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_ctype_store,
    id: "cash_item_ctype_fltr_cb",
    name: "cash_item_ctype_fltr_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 170,
    editable: false
}); //cash_item_ctype_fltr_cb

var cash_item_price_fltr = {
  xtype: 'toolbar',
  id: "cash_item_price_fltr",
  name: "cash_item_price_fltr",
  colspan: 2,
  items: [cash_item_price_frm_fltr, cash_item_price_to_fltr, cash_item_currency_fltr_cb]
}; //cash_item_price_fltr

var cash_item_toper_cb_fltr = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_toper_store,
    id: "cash_item_toper_cb_fltr",
    name: "cash_item_toper_cb_fltr",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 200,
    fieldLabel: lang(56),
    labelWidth: 100,
    editable: false
}); //cash_item_toper_cb_fltr

var cash_item_type_fltr = {
  xtype: 'toolbar',
  id: "cash_item_type_fltr",
  name: "cash_item_type_fltr",
  colspan: 2,
  items: [cash_item_toper_cb_fltr, cash_item_ctype_fltr_cb]
}; //cash_item_type_fltr



var cash_item_org_fltr_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_org_store,
    id: "cash_item_org_fltr_cb",
    name: "cash_item_org_fltr_cb",
    displayField: 'name',
    valueField: 'id',
    //queryMode: 'local',
    width: 474,
    fieldLabel: lang(26),
    labelWidth: 100
}); //cash_item_org_fltr_cb

var cash_item_org_fltr_cb_no = {
    xtype:      'checkboxfield',
    boxLabel  : lang(68),
    name      : 'cash_item_org_fltr_cb_no',
    inputValue: '0',
    id        : 'cash_item_org_fltr_cb_no'
}; //cash_item_org_fltr_cb_no

var cash_item_note_fltr = {
    xtype: 'textareafield',
    name: 'cash_item_note_fltr',
    id: "cash_item_note_fltr",
    fieldLabel: lang(35),
    labelWidth: 100,
    width: 474
};

var cash_item_note_fltr_no = {
    xtype:      'checkboxfield',
    boxLabel  : lang(68),
    name      : 'cash_item_note_fltr_no',
    inputValue: '0',
    id        : 'cash_item_note_fltr_no'
}; //cash_item_note_fltr_no

var cash_item_user_fltr_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  //pageSize: 10,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/usr_list_name.php?DB_ID=1',
      reader: {
        type: 'json'
      }
  }
}); //cash_item_user_fltr_store

var cash_item_user_cb_fltr = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_user_fltr_store,
    id: "cash_item_user_cb_fltr",
    name: "cash_item_user_cb_fltr",
    fieldLabel: lang(30),
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 200,
    editable: false,
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
    }
}); //cash_item_user_cb_fltr

var cash_item_file_fltr = {
    xtype:      'checkboxfield',
    boxLabel  : lang(28),
    name      : 'cash_item_file_fltr',
    inputValue: '0',
    id        : 'cash_item_file_fltr'
}; //cash_item_file_fltr

var cash_item_del_fltr = {
    xtype:      'checkboxfield',
    boxLabel  : lang(69),
    name      : 'cash_item_del_fltr',
    inputValue: '0',
    id        : 'cash_item_del_fltr'
}; //cash_item_del_fltr

var cash_list_fltr_refresh =
{
	xtype: 'button',
	text: lang(70),
	icon: settings.static + "/refresh.gif",
	tooltip: lang(71),
	border: true,
	cls: "x-btn-default-small",
	handler : listRefresh
};

var cash_list_fltr_clear =
{
	xtype: 'button',
	text: lang(72),
	tooltip: lang(73),
	border: true,
	cls: "x-btn-default-small",
	handler : setDefaultFltr
};

var cash_item_els_fltr = {
  xtype: 'toolbar',
  colspan: 2,
  items: [cash_item_user_cb_fltr, cash_item_file_fltr, cash_item_del_fltr, "->", cash_list_fltr_clear, cash_list_fltr_refresh]
}; //cash_item_els_fltr

function setDefaultFltr() {
  Ext.getCmp('cash_item_nmcl_cb_fltr').setValue("");
  Ext.getCmp('cash_item_nmcl_cb_fltr_no').setValue("");
  Ext.getCmp('cash_item_prod_type_cb_fltr').setValue("");
  Ext.getCmp('cash_item_prod_type_cb_fltr_no').setValue("");
  Ext.getCmp('cash_item_price_frm_fltr').setValue("");
  Ext.getCmp('cash_item_price_to_fltr').setValue("");
  Ext.getCmp('cash_item_currency_fltr_cb').setValue("");
  Ext.getCmp('cash_item_toper_cb_fltr').setValue("");
  Ext.getCmp('cash_item_ctype_fltr_cb').setValue("");
  Ext.getCmp('cash_item_org_fltr_cb').setValue("");
  Ext.getCmp('cash_item_org_fltr_cb_no').setValue("");
  Ext.getCmp('cash_item_note_fltr').setValue("");
  Ext.getCmp('cash_item_note_fltr_no').setValue("");
  Ext.getCmp('cash_item_user_cb_fltr').setValue("");  
  Ext.getCmp('cash_item_file_fltr').setValue("");
  Ext.getCmp('cash_item_del_fltr').setValue("");
}


///--------------- loadFilter
function loadFilter(_cb) {
  //once load
  if( Ext.getCmp('cash_list_tb_filter_bgrp').items.length > 0 ) {
    setDefaultFltr();
    if(_cb != undefined) _cb();
    return;
  }

  //add items
  var tb = Ext.getCmp('cash_list_tb_filter_bgrp');
  tb.suspendLayouts();
  tb.add(cash_item_nmcl_cb_fltr);
  tb.add(cash_item_nmcl_cb_fltr_no);
  tb.add(cash_item_prod_type_cb_fltr);
  tb.add(cash_item_prod_type_cb_fltr_no);
  tb.add(cash_item_price_fltr);
  tb.add(cash_item_type_fltr);
  tb.add(cash_item_org_fltr_cb);
  tb.add(cash_item_org_fltr_cb_no);
  tb.add(cash_item_note_fltr);
  tb.add(cash_item_note_fltr_no);
  tb.add(cash_item_els_fltr);
  tb.resumeLayouts(true);

  cash_item_nmcl_store.load(function() {
    cash_item_prod_type_store.load(function() {
      cash_item_currency_store.load(function() {
        cash_item_ctype_store.load(function() {
          cash_item_org_store.load(function() {
            cash_item_user_fltr_store.proxy.url = 'ajax/usr_list_name.php?DB_ID=' + db_id;
            cash_item_user_fltr_store.load(function() {
              setDefaultFltr();
              if(_cb != undefined) _cb();
            });
          });
        });
      });
    });
  }); //load
} //loadFilter