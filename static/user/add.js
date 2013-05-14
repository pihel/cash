var v_edit_id = 0;

//---- date
var cash_item_date =
{
    xtype: 'datefield',
    startDay:1,
    fieldLabel: 'Дата',
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
	{name: 'id',      type: 'INT'},
	{name: 'name',    type: 'text'}
    ],
    idProperty: 'id'
});

var cash_item_nmcl_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/nmcl_list.php',
      reader: {
	  type: 'json'
      }
  }
}); //cash_item_nmcl_store

var cash_item_nmcl_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_nmcl_store,
    id: "cash_item_nmcl_cb",
    name: "cash_item_nmcl_cb",
    fieldLabel: 'Товар',
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 474,
    allowBlank: false,
    listeners: {
	select: function( combo, records, e) {
	  if(records != undefined && records[0].get('id') != 0) {

	    Ext.Ajax.request({
		url: "ajax/nmcl_param.php",
		method: "GET",
		params: {
		    nmcl_id: records[0].get('id')
		},
		success: function(data) {
		    var obj = Ext.decode(data.responseText);

		    Ext.getCmp('cash_item_prod_type_cb').setValue(obj.grp);
		    Ext.getCmp('cash_item_org_cb').setValue(obj.org_id);
		    Ext.getCmp('cash_item_price').focus(false, 200);
		}//success
	    }); //Ext.Ajax.request
	  }
	}
    },
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
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
}); //cash_item_nmcl_store

var cash_item_prod_type_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_prod_type_store,
    id: "cash_item_prod_type_cb",
    name: "cash_item_prod_type_cb",
    fieldLabel: 'Группа',
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    width: 474,
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
    }
}); //cash_item_prod_type_cb


//----price
var cash_item_price = {
    xtype: 'numberfield',
    id: "cash_item_price",
    name: "cash_item_price",
    fieldLabel: 'Цена',
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    allowBlank: false,
    value: 0
};

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
}); //cash_item_nmcl_store

var cash_item_currency_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_currency_store,
    id: "cash_item_currency_cb",
    name: "cash_item_currency_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
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
    width: 170,
    value: 1
}); //cash_item_ctype_cb


//----qnt
var cash_item_qnt = {
    xtype: 'numberfield',
    id: "cash_item_qnt",
    name: "cash_item_qnt",
    fieldLabel: 'Количество',
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    value: 1
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
}); //cash_item_nmcl_store

var cash_item_org_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_org_store,
    id: "cash_item_org_cb",
    name: "cash_item_org_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 474,
    fieldLabel: 'Получатель',
    allowBlank: false,
    labelWidth: 100,
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
    }
}); //cash_item_currency_cb


//---- type oper list
var cash_item_toper_store = Ext.create('Ext.data.Store', {
  model: 'cash_id_name_model',
  data : [
         {id: 0,    name: 'Расход'},
         {id: 1,    name: 'Приход'}
     ]
}); //cash_item_nmcl_store

var cash_item_toper_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_item_toper_store,
    id: "cash_item_toper_cb",
    name: "cash_item_toper_cb",
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 200,
    fieldLabel: 'Тип операции',
    allowBlank: false,
    labelWidth: 100,
    value: 0,
    editable: false
}); //cash_item_currency_cb


//---- file
var cash_item_file = {
    xtype: 'filefield',
    id: "cash_item_file",
    name: "cash_item_file",
    fieldLabel: 'Файл',
    labelWidth: 100,
    width: 474,
    buttonText: 'Прикрепить...'
};

//---- note
var cash_item_note = {
    xtype: 'textfield',
    name: 'cash_item_note',
    id: "cash_item_note",
    fieldLabel: 'Примечание',
    labelWidth: 100,
    width: 474,
    height: 50
};

//---  save
var cash_item_save = Ext.create('Ext.button.Button', {
	text: 'Сохранить',
	formBind: true,
	id: "cash_item_save",
	icon: "static/ext/resources/themes/images/default/tree/drop-yes.gif",
	disabled: true,
	handler : function() {
	  cash_list_add.setLoading("Сохранение операции...");

	  var form = this.up('form').getForm();
	  form.submit({
	      success: function(form, action) {
		  cash_list_add.setLoading(false);
		  cash_list_add.hide();
		  listRefresh();
	      },
	      failure: function(form, action) {
		  error(action.result.msg, function() {
		    cash_list_add.setLoading(false);
		  });
	      }
	  }); //form.submit
	}
});

var cash_item_add = Ext.create('Ext.button.Button', {
	text: 'Добавить',
	formBind: true,
	id: "cash_item_add",
	icon: "static/ext/resources/themes/images/default/tree/drop-yes.gif",
	disabled: true,
	tabIndex: -1,
	handler : function() {
	  if(v_edit_id > 0) return;
	  cash_list_add.setLoading("Добавление операции...");

	  var form = this.up('form').getForm();
	    form.submit({
		success: function(form, action) {
		    cash_list_add.setLoading(false);
		    //cash_list_add.hide();
		    setDefault();
		    listRefresh();
		},
		failure: function(form, action) {
		    error(action.result.msg, function() {
		      cash_list_add.setLoading(false);
		    });
		}
	    });
	}
});


var cash_item_cancel = Ext.create('Ext.button.Button',
{
	text: 'Отмена',
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
	      cash_item_ctype_cb,]
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
	  cash_item_file,
	  cash_item_note,
	  cash_item_edit_id
 	 ],
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
  Ext.getCmp('cash_item_file').setValue("");
  Ext.getCmp('cash_item_note').setValue("");
  Ext.getCmp('cash_item_edit_id').setValue(0);
  Ext.getCmp('cash_list_add').setTitle("Добавление операции");
}

function cash_list_add_load() {
  Ext.getCmp('cash_item_edit_id').setValue(v_edit_id);
  Ext.getCmp('cash_item_edit_id_label').setText(v_edit_id);


  if(v_edit_id == 0) {
    setDefault();
    Ext.getCmp('cash_item_add').setVisible(true);
    cash_list_add.setLoading(false);
    Ext.getCmp('cash_item_edit_id_label').setText("");
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
	  Ext.getCmp('cash_item_file').setValue(obj.file);
	  Ext.getCmp('cash_item_note').setValue(obj.note);
	  Ext.getCmp('cash_list_add').setTitle("Редактирование операции");

	  Ext.getCmp('cash_item_add').setVisible(false);

	  cash_list_add.setLoading(false);
      }//success
  }); //Ext.Ajax.request
}

///-----window
var cash_list_add = Ext.create('Ext.Window', {
      title: 'Добавление операции',
      id: "cash_list_add",
      width: 510,
      height: 355,
      closeAction: 'hide',
      modal: true,
      headerPosition: 'top',
      bodyPadding: 5,
      items: [cash_item_form_add],
      listeners: {
	show: function(){
	  cash_list_add.setLoading("Загрузка формы...");
	  cash_item_nmcl_store.load(function() {
	    cash_item_prod_type_store.load(function() {
	      cash_item_currency_store.load(function() {
		cash_item_ctype_store.load(function() {
		  cash_item_org_store.load(function() {
		    cash_list_add_load();
		  });
		});
	      });
	    });
	  });
	}
      }
}); //cash_list_add