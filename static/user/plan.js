var cash_plan_model = Ext.define('cash_plan_model', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'id', 		type: 'int'},
	{name: 'db_id',		type: 'int'},
	{name: 'usr_id', 	type: 'int'},
	{name: 'grp_id',	type: 'int'},
	{name: 'name',	type: 'string'},
	{name: 'plan', 		type: 'double'}
    ],
    idProperty: 'id'
});

var cash_plan_store = Ext.create('Ext.data.Store', {
    model: 'cash_plan_model',
    autoLoad: false,
    proxy: {
	type: 'ajax',
	url: 'ajax/plan.php'
    }
}); //cash_plan_store

var cash_plan_grid = Ext.create('Ext.grid.Panel', {
    store: cash_plan_store,
    id: "cash_plan_grid",
    title: 'Планы расхода по группам в месяц',
    header: true,
    width: Ext.getBody().getWidth() - 30,
    height: Ext.getBody().getHeight()/3,
    forceFit: true,
    columns: [
	{text: "ID", 			dataIndex: 'id', 	hidden: true, 	tdCls: 'x-center-cell', width: 30 },
	{text: "ID базы", 		dataIndex: 'db_id', 	hidden: true, 	tdCls: 'x-center-cell', width: 30 },
	{text: "ID пользователя", 	dataIndex: 'usr_id',	hidden: true, 	tdCls: 'x-center-cell', width: 30 },
	{text: "ID группы", 		dataIndex: 'grp_id',	width: 75	},
	{text: "Группа", 		dataIndex: 'name', 	flex: true	},
	{text: "План", 			dataIndex: 'plan'	,editor: {xtype: 'numberfield', allowBlank: true}},
	{
	    menuDisabled: true,
	    sortable: false,
	    hideable: false,
	    xtype: 'actioncolumn',
	    width: 30,
	    items: [ {
		icon: "static/ext/resources/themes/images/access/tree/drop-yes.gif",
		tooltip: 'Сохранить запись',
		handler: function(grid, rowIndex, colIndex) {
		    var rec = grid.getStore().getAt(rowIndex);
		    console.log(rec.data);
		}
	    }]
	}
    ],
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ]
}); //cash_plan_grid

var loadMask_cash_plan_grid = new Ext.LoadMask(cash_plan_grid, {msg:'Загрузка списка пользователей...', store: cash_plan_store});


var cash_plan_panel = Ext.create('Ext.Panel', {
    id: "cash_plan_panel",
    border: false,
    items: [cash_plan_grid],
    listeners: {
	afterrender: function(){
	  cash_plan_store.load();
	}
    }

});//cash_plan_panel