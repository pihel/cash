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

var cash_set_db_grid = Ext.create('Ext.grid.Panel', {
    store: cash_set_db_store,
    id: "cash_set_db_grid",
    title: 'Список баз данных',
    header: true,
    forceFit: true,
    width: 300,
    columns: [
	{text: "ID", 	dataIndex: 'id', 	hidden: true, 	tdCls: 'x-center-cell' },
	{text: "База", 	dataIndex: 'name', 	flex: 1, 	hideable: false}
    ],
    listeners: {
	itemclick: function(view,rec,item,index,eventObj) {
	    cash_set_usr_store.proxy.url = 'ajax/usr_list.php?DB_ID=' + rec.get('id');
	    cash_set_usr_store.load(function() {
	      cash_set_usr_grid.setTitle("Список пользователей базы '" + rec.get('name') + "' и их права");
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

var cash_set_usr_grid = Ext.create('Ext.grid.Panel', {
    store: cash_set_usr_store,
    id: "cash_set_usr_grid",
    title: 'Список пользователей базы данных и их права',
    header: true,
    width: Ext.getBody().getWidth() - 350,
    height: 400,
    forceFit: true,
    columns: [
	{text: "ID", 		dataIndex: 'id', 	hidden: true, 	tdCls: 'x-center-cell' },
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