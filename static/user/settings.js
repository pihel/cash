var cash_set_db_model = Ext.define('cash_set_db_model', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'id', 		type: 'int'},
	{name: 'name', 		type: 'string'}
    ],
    idProperty: 'id'
});

var cash_set_db_store = Ext.create('Ext.data.Store', {
    model: 'cash_set_db_model',
    autoLoad: false,
    proxy: {
	type: 'ajax',
	url: 'ajax/db_list.php'
    }
}); //cash_set_db_store

var cash_set_db_add = Ext.create('Ext.button.Button', {
  text: 'Добавить',
  icon: "static/ext/resources/themes/images/access/tree/drop-add.gif",
  handler : function () {
    var res = "";
    Ext.MessageBox.prompt('Имя БД', 'Введи имя базы данных', function(id, txt) {
      Ext.Ajax.request({
	  url: "ajax/add_db.php",
	  method: "POST",
	  params: {
	      name: txt
	  },
	  success: function(data) {
	      cash_set_db_store.load();
	  }//success
      }); //Ext.Ajax.request
      //cash_set_db_store.add({id:0, name: txt});
    });
  }
}); //cash_set_db_add

var cash_set_db_del = Ext.create('Ext.button.Button', {
  text: 'Удалить',
  icon: "static/delete.gif",
  disabled: true,
  handler : function () {
    var selection = cash_set_db_grid.getView().getSelectionModel().getSelection()[0];
    if (selection) {
	cash_set_db_store.remove(selection);
	cash_set_db_del.setDisabled(true);
    }
  }
}); //cash_set_db_del


var cash_set_db_grid = Ext.create('Ext.grid.Panel', {
    store: cash_set_db_store,
    id: "cash_set_db_grid",
    title: 'Список баз данных',
    header: true,
    forceFit: true,
    width: 300,
    dockedItems: [{
          xtype: 'toolbar',
	  border: true,
          items: [cash_set_db_add, cash_set_db_del]
    }],
    columns: [
	{text: "ID", 	dataIndex: 'id', 	hidden: true, 	tdCls: 'x-center-cell' },
	{text: "База", 	dataIndex: 'name', 	flex: 1, 	hideable: false}
    ],
    listeners: {
	itemclick: function(view,rec,item,index,eventObj) {
	    cash_set_usr_store.proxy.url = 'ajax/usr_list.php?DB_ID=' + rec.get('id');
	    cash_set_usr_store.load(function() {
	      cash_set_usr_grid.setTitle("Список пользователей базы '" + rec.get('name') + "' и их права");
	      cash_set_db_del.setDisabled(false);
	      cash_set_usr_add.setDisabled(false);
	      cash_set_usr_save.setDisabled(false);
	      cash_set_usr_del.setDisabled(true);
	    });
	}
    },
    viewConfig: {
	loadMask:false
    }
}); //cash_set_db_grid

var loadMask_cash_set_db_grid = new Ext.LoadMask(cash_set_db_grid, {msg:'Загрузка списка баз...', store: cash_set_db_store});

//---

var cash_set_usr_model = Ext.define('cash_set_usr_model', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'id', 		type: 'int'},
	{name: 'bd_id',		type: 'int'},
	{name: 'login', 	type: 'string'},
	{name: 'pasw',	 	type: 'string'},
	{name: 's_read',	type: 'bool'},
	{name: 's_write', 	type: 'bool'},
	{name: 's_analiz', 	type: 'bool'},
	{name: 's_setting', 	type: 'bool'},
	{name: 'oper_date',	type: 'DATE', dateFormat : "d.m.Y H:i"}
    ],
    idProperty: 'id'
});

var cash_set_usr_store = Ext.create('Ext.data.Store', {
    model: 'cash_set_usr_model',
    autoLoad: false,
    proxy: {
	type: 'ajax',
	url: 'ajax/usr_list.php?DB_ID=0'
    }
}); //cash_set_usr_store


var cash_set_usr_add = Ext.create('Ext.button.Button', {
  text: 'Добавить',
  disabled: true,
  icon: "static/ext/resources/themes/images/access/tree/drop-add.gif",
  handler : function () {
    cash_set_usr_store.add({id:0, bd_id: cash_set_db_grid.getView().getSelectionModel().getSelection()[0].data.id }); //oper_date: new Date()
  }
}); //cash_set_usr_add

var cash_set_usr_del = Ext.create('Ext.button.Button', {
  text: 'Удалить',
  disabled: true,
  icon: "static/delete.gif",
  handler : function () {
    var selection = cash_set_usr_grid.getView().getSelectionModel().getSelection()[0];
    if (selection) {
	cash_set_usr_store.remove(selection);
	cash_set_usr_del.setDisabled(true);
    }
  }
}); //cash_set_usr_del

var cash_set_usr_save = Ext.create('Ext.button.Button', {
  text: 'Сохранить',
  disabled: true,
  icon: "static/ext/resources/themes/images/access/tree/drop-yes.gif",
  handler : function () {
    cash_set_usr_grid.setLoading("Подождите, идет сохранение фотографий...");
  }
}); //cash_set_usr_save

var cash_set_usr_grid = Ext.create('Ext.grid.Panel', {
    store: cash_set_usr_store,
    id: "cash_set_usr_grid",
    title: 'Список пользователей базы данных и их права',
    header: true,
    width: Ext.getBody().getWidth() - 350,
    height: 400,
    forceFit: true,
    tbar: [cash_set_usr_add, cash_set_usr_del, " ", " ", cash_set_usr_save],
    columns: [
	{text: "ID", 		dataIndex: 'id', 	tdCls: 'x-center-cell', width: 20 },
	{text: "ID базы", 	dataIndex: 'bd_id', 	hidden: true, 	tdCls: 'x-center-cell' },
	{text: "Пользователь", 	dataIndex: 'login'	,editor: {xtype: 'textfield', allowBlank: false} },
	{text: "Пароль", 	dataIndex: 'pasw'	,editor: {xtype: 'textfield', allowBlank: false} },
	{text: "Чтение", 	dataIndex: 's_read'	,xtype: 'checkcolumn'},
	{text: "Запись", 	dataIndex: 's_write'	,xtype: 'checkcolumn'},
	{text: "Аналитика", 	dataIndex: 's_analiz'	,xtype: 'checkcolumn'},
	{text: "Настройки", 	dataIndex: 's_setting'	,xtype: 'checkcolumn'},
	{text: "Последний вход",dataIndex: 'oper_date'	}
    ],
    selType: 'cellmodel',
    listeners: {
	itemclick: function(view,rec,item,index,eventObj) {
	  cash_set_usr_del.setDisabled(false);
	}
    },
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ]
}); //cash_set_usr_grid

var loadMask_cash_set_usr_grid = new Ext.LoadMask(cash_set_usr_grid, {msg:'Загрузка списка пользователей...', store: cash_set_usr_store});

var cash_set_panel = Ext.create('Ext.Panel', {
    id: "cash_set_panel",
    layout: {
      type: 'hbox',
      padding:'5',
      align: 'stretchmax'
    },
    border: false,
    height: Ext.getBody().getHeight() - 50,
    items: [cash_set_db_grid,{xtype: 'splitter'}, cash_set_usr_grid],
    listeners: {
	afterrender: function(){
	  cash_set_db_store.load(function() {
	    //cash_set_usr_store.load();
	  });
	}
    }

});//cash_set_panel