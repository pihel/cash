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
    fieldLabel: 'Товар',
    labelWidth: 100,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 474,
    allowBlank: false,
    listeners: {
	change: function(field, newValue, oldValue) {
	  //
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
    name: 'cash_item_price',
    id: "cash_item_price",
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
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 170,
    value: 1
}); //cash_item_currency_cb


//----qnt
var cash_item_qnt = {
    xtype: 'numberfield',
    name: 'cash_item_qnt',
    id: "cash_item_qnt",
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
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    width: 200,
    fieldLabel: 'Тип операции',
    allowBlank: false,
    labelWidth: 100,
    value: 0
}); //cash_item_currency_cb


//---- file
var cash_item_file = {
    xtype: 'filefield',
    name: 'cash_item_file',
    fieldLabel: 'Файл',
    labelWidth: 100,
    width: 474,
    buttonText: 'Прикрепить...'
};

//---- note
var cash_item_note = {
    xtype: 'textareafield',
    name: 'cash_item_note',
    id: "cash_item_note",
    fieldLabel: 'Примечание',
    labelWidth: 100,
    width: 474,
    height: 50
};

//---  save
var cash_item_save =
{
	xtype: 'button',
	text: 'Сохранить',
	icon: "static/ext/resources/themes/images/default/tree/drop-yes.gif",
	handler : function() {
	  alert(1);
	}
}


var cash_item_cancel =
{
	xtype: 'button',
	text: 'Отмена',
	handler : function() {
	  cash_list_add.hide();
	}
}

//---price
var cash_item_price_tb = {
      xtype: 'toolbar',
      id: "cash_item_price_tb",
      items: [cash_item_price,
	      cash_item_currency_cb,
	      cash_item_ctype_cb,]
}; //cash_item_price_tb

//save button
var cash_item_tb = {
      xtype: 'toolbar',
      dock: 'bottom',
      ui: 'footer',
      items: ["->", cash_item_save, " ", cash_item_cancel]
}; //cash_list_tb


///-----window
var cash_list_add = Ext.create('Ext.Window', {
      title: 'Добавление операции',
      width: 500,
      height: 345,
      closeAction: 'hide',
      modal: true,
      headerPosition: 'top',
      bodyPadding: 5,
      items: [cash_item_date,
	      cash_item_nmcl_cb,
	      cash_item_prod_type_cb,
	      cash_item_price_tb,
	      cash_item_qnt,
	      cash_item_org_cb,
	      cash_item_toper_cb,
	      cash_item_file,
	      cash_item_note,
	      cash_item_tb
 	    ],
      listeners: {
	show: function(){
	  cash_list_add.setLoading("Загрузка формы...");
	  cash_item_nmcl_store.load(function() {
	    cash_item_prod_type_store.load(function() {
	      cash_item_currency_store.load(function() {
		cash_item_ctype_store.load(function() {
		  cash_item_org_store.load(function() {
		    cash_list_add.setLoading(false);
		  });
		});
	      });
	    });
	  });
	}
      }
}); //cash_list_add