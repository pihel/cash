/* grid list */

var cash_list_model = Ext.define('cash_list_model', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'id', 		type: 'int'},
	{name: 'nmcl_id', 	type: 'int'},
	{name: 'nom', 		type: 'string'},
	{name: 'group', 	type: 'int'},
	{name: 'gname', 	type: 'string'},
	{name: 'price', 	type: 'double'},
	{name: 'qnt', 		type: 'double'},
	{name: 'amount', 	type: 'double'},
	{name: 'oper_date',	type: 'DATE', dateFormat : "Y-m-d"},
	{name: 'date_edit', 	type: 'DATE', dateFormat: "Y-m-d H:i:s"},
	{name: 'org_id', 	type: 'int'},
	{name: 'oname', 	type: 'string'},
	{name: 'type', 		type: 'int'},
	{name: 'note',		type: 'string'},
	{name: 'file', 		type: 'string'},
	{name: 'uid', 		type: 'int'},
	{name: 'rate', 		type: 'double'},
	{name: 'sign', 		type: 'string'},
	{name: 'cash_type_id', 	type: 'int'},
	{name: 'cash_type', 	type: 'string'}
    ],
    idProperty: 'id'
});

var cash_list_store = Ext.create('Ext.data.Store', {
    model: 'cash_list_model',
    autoLoad: false,
    proxy: {
	type: 'ajax',
	url: 'ajax/list.php?'
    }
}); //cash_list_store

var cash_list_grid = Ext.create('Ext.grid.Panel', {
    store: cash_list_store,
    columns: [
	{text: "ID", 			dataIndex: 'id', 		hidden: true, 	tdCls: 'x-center-cell' },
	{text: "ID товара", 		dataIndex: 'nmcl_id', 		hidden: true , 	tdCls: 'x-center-cell'},
	{text: "Товар", 		dataIndex: 'nom', 		flex: 1, 	hideable: false},
	{text: "ID группы", 		dataIndex: 'group', 		hidden: true , 	tdCls: 'x-center-cell'},
	{text: "Группа", 		dataIndex: 'gname',		hideable: true },
	{text: "Цена", 			dataIndex: 'price',		hideable: false, renderer: price, tdCls: 'x-price-cell' },
	{text: "Кол-во", 		dataIndex: 'qnt',		hideable: false, summaryType: 'sum', tdCls: 'x-center-cell' },
	{text: "Сумма", 		dataIndex: 'amount',		hideable: true,  renderer: price_r, summaryType: 'sum' , tdCls: 'x-amount-cell' , summaryRenderer: price },
	{text: "Дата", 			dataIndex: 'oper_date',		hideable: true, renderer: dateRender, tdCls: 'x-center-cell'  },
	{text: "Дата изменения", 	dataIndex: 'date_edit', 	hidden: true,   renderer: dateTimeRender, tdCls: 'x-center-cell' },
	{text: "ID магазина", 		dataIndex: 'org_id', 		hidden: true, 	tdCls: 'x-center-cell' },
	{text: "Магазин", 		dataIndex: 'oname',		hideable: true },
	{text: "Тип", 			dataIndex: 'type', 		hidden: true , 	tdCls: 'x-center-cell'},
	{text: "Примечание", 		dataIndex: 'note', 		width: 250 },
	{text: "Файл", 			dataIndex: 'file',		hidden: true },
	{text: "ID пользователя", 	dataIndex: 'uid', 		hidden: true, 	tdCls: 'x-center-cell' },
	{text: "Курс", 			dataIndex: 'rate', 		hidden: true },
	{text: "Знак валюты", 		dataIndex: 'sign',		hidden: true },
	{text: "Тип валюты", 		dataIndex: 'cash_type_id', 	hidden: true, 	tdCls: 'x-center-cell' },
	{text: "Кошелек", 		dataIndex: 'cash_type', 	hidden: true, 	tdCls: 'x-center-cell' },
	{
	      menuDisabled: true,
	      sortable: false,
	      hideable: false,
	      xtype: 'actioncolumn',
	      width: 50,
	      id: "cash_list_edit_col",
	      items: [{
		  iconCls: 'edit-cash-col',
		  tooltip: 'Редактировать запись',
		  handler: function(grid, rowIndex, colIndex) {
		      var rec = grid.getStore().getAt(rowIndex);
		      editItem(rec.get('id'));
		  }
	      }, {
		  iconCls: 'del-cash-col',
		  tooltip: 'Удалить запись',
		  handler: function(grid, rowIndex, colIndex) {
		      var rec = grid.getStore().getAt(rowIndex);
		      deleteItem(rec.get('id'));
		  }
	      }]
	  }
    ],
    listeners: {
      cellkeydown: function( obj, td, cellIndex, record, tr, rowIndex, e, eOpts ){
	  var key = e.getKey();
	  if(key == Ext.EventObject.ENTER) {
	    editItem(record.get('id'));
	  } else if(key == Ext.EventObject.DELETE) {
	    deleteItem(record.get('id'));
	  }
      },
      itemdblclick: function(dv, record, item, index, e) {
	editItem(record.get('id'));
      }
    },
    features: [{
        ftype: 'summary'
    },
    {
      ftype: 'filters',
      encode: true,
      local: true,
      autoReload: false,
      filters: [
	{dataIndex: 'id', 		type: 'int'},
	{dataIndex: 'nmcl_id', 		type: 'int'},
	{dataIndex: 'nom', 		type: 'string'},
	{dataIndex: 'group', 		type: 'int'},
	{dataIndex: 'gname', 		type: 'string'},
	{dataIndex: 'price', 		type: 'numeric'},
	{dataIndex: 'qnt', 		type: 'numeric'},
	{dataIndex: 'amount', 		type: 'numeric'},
	{dataIndex: 'oper_date'	},
	{dataIndex: 'date_edit'	},
	{dataIndex: 'org_id', 		type: 'int'},
	{dataIndex: 'oname', 		type: 'string'},
	{dataIndex: 'type', 		type: 'int'},
	{dataIndex: 'note',		type: 'string'},
	{dataIndex: 'file', 		type: 'string'},
	{dataIndex: 'uid', 		type: 'int'},
	{dataIndex: 'rate', 		type: 'numeric'},
	{dataIndex: 'sign', 		type: 'string'},
	{dataIndex: 'cash_type_id', 	type: 'int'},
	{dataIndex: 'cash_type', 	type: 'string'}]
    }],
    region:'center'
}); //cash_list_grid

var loadMask_cash_list_grid = new Ext.LoadMask(cash_list_grid, {msg:'Загрузка списка операций...', store: cash_list_store});


function editItem(v_id) {
  if(parseInt(rights.write) == 0) return;
  loadScript('static/user/add.js', function() {
    v_edit_id = v_id;
    cash_list_add.show();
  });
}


function deleteItem(v_id) {
  if(parseInt(rights.write) == 0) return;
  Ext.Msg.show({
      title:'Удаление операции',
      msg: 'Удалить операцию?',
      icon: Ext.MessageBox.QUESTION,
      buttons: Ext.Msg.OKCANCEL,
      fn: function(buttonId) {
	//if clicked ok
	if(buttonId == "ok") {
	    cash_list_grid.setLoading("Удаляю операцию...");
	    Ext.Ajax.request({
	      url: "ajax/delete.php",
	      method: "GET",
	      params: {
		  id: v_id
	      },
	      success: function(data) {
		  // if response is not empty - error msg
		  if(data.responseText != "") {
		    error(data.responseText, function() {
		      cash_list_grid.setLoading(false);
		      //listRefresh();
		      return;
		    });
		  }
		  cash_list_grid.setLoading(false);
		  listRefresh();
	      } //success
	  }); //Ext.Ajax.request
	} //buttonId == "ok"
      } // fn - button click
  });//Ext.Msg.show
}


/* panel with grid */
var cash_list_from_date =
{
    xtype: 'datefield',
    startDay:1,
    fieldLabel: 'Период',
    name: 'cash_list_from_date',
    id: 'cash_list_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: listRefresh
}; // cash_list_from_date


var cash_list_to_date =
{
    xtype: 'datefield',
    fieldLabel: 'по',
    startDay:1,
    name: 'cash_list_to_date',
    id: 'cash_list_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: listRefresh
}; // cash_list_to_date

function listRefresh(_cb) {
  if(Ext.getCmp('cash_list_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_list_to_date').getValue() == null) return;

  cash_list_store.proxy.url = "ajax/list.php?from=" + Ext.Date.format(Ext.getCmp('cash_list_from_date').getValue(),'Y-m-d') +
					    "&to=" + Ext.Date.format(Ext.getCmp('cash_list_to_date').getValue(),'Y-m-d');
  //extend filter
  if(Ext.getCmp('cash_item_nmcl_cb_fltr') != undefined &&
     Ext.getCmp('cash_list_filter').getValue()
  ) {
    cash_list_store.proxy.url += "&exfilter=1";
    cash_list_store.proxy.url += "&nmcl_id=" + Ext.getCmp('cash_item_nmcl_cb_fltr').getValue();
    cash_list_store.proxy.url += "&nmcl_id_no=" + (0+Ext.getCmp('cash_item_nmcl_cb_fltr_no').getValue());
    cash_list_store.proxy.url += "&pt_id=" + Ext.getCmp('cash_item_prod_type_cb_fltr').getValue();
    cash_list_store.proxy.url += "&pt_id_no=" + (0+Ext.getCmp('cash_item_prod_type_cb_fltr_no').getValue());
    cash_list_store.proxy.url += "&price_from=" + (0+Ext.getCmp('cash_item_price_frm_fltr').getValue());
    cash_list_store.proxy.url += "&price_to=" + (0+Ext.getCmp('cash_item_price_to_fltr').getValue());
    cash_list_store.proxy.url += "&cur_id=" + Ext.getCmp('cash_item_currency_fltr_cb').getValue();
    cash_list_store.proxy.url += "&oper_id=" + Ext.getCmp('cash_item_toper_cb_fltr').getValue();
    cash_list_store.proxy.url += "&ctype_id=" + Ext.getCmp('cash_item_ctype_fltr_cb').getValue();
    cash_list_store.proxy.url += "&org_id=" + Ext.getCmp('cash_item_org_fltr_cb').getValue();
    cash_list_store.proxy.url += "&org_id_no=" + (0+Ext.getCmp('cash_item_org_fltr_cb_no').getValue());
    cash_list_store.proxy.url += "&note=" + Ext.getCmp('cash_item_note_fltr').getValue();
    cash_list_store.proxy.url += "&note_no=" + (0+Ext.getCmp('cash_item_note_fltr_no').getValue());
    cash_list_store.proxy.url += "&file=" + (0+Ext.getCmp('cash_item_file_fltr').getValue());
    cash_list_store.proxy.url += "&del=" + (0+Ext.getCmp('cash_item_del_fltr').getValue());
  }


  cash_list_store.load(function(e) {
    if(typeof _cb == "function") _cb(e);
  });

  setAnkhor();
}

/*var cash_list_refresh =
{
	xtype: 'button',
	text: 'Обновить',
	icon: "static/ext/resources/themes/images/default/grid/refresh.gif",
	tooltip: 'Перегрузить список с новыми параметрами',
	border: true,
      	cls: "x-btn-default-small",
	handler : listRefresh
}*/

var cash_list_filter_loading = Ext.create('Ext.Img', {
    src: 'static/ext/resources/themes/images/default/tree/loading.gif',
    id: 'cash_list_filter_loading',
    name: "cash_list_filter_loading",
    mode: 'element',
    title: "Загрузка фильтра",
    style: {
	//display: "none",
	margin: "1px 0px 0px 5px"
    }
});//w_img

var cash_list_filter = {
    xtype:      'checkboxfield',
    boxLabel  : 'Расширенный поиск',
    name      : 'cash_list_filter',
    inputValue: '0',
    id        : 'cash_list_filter',
    onChange: function(newVal, oldVal) {
      if(newVal && Ext.getCmp('cash_list_tb_filter').isVisible()) return;
      Ext.getCmp('cash_list_filter_loading').show();
      loadScript("static/user/add.js", function() {
	loadScript("static/user/filter.js", function() {
	  loadFilter(function() {
	    if(newVal) {
	      Ext.getCmp('cash_list_tb_filter').show();
	    } else {
	      Ext.getCmp('cash_list_tb_filter').hide();
	    }
	    listRefresh(function() {
	      //Ext.getCmp('cash_list_filter_loading').hide();
	    });
	    Ext.getCmp('cash_list_filter_loading').hide();
	  }); //loadFilter
	}); //loadScript
      }); //loadScript
    } //onChange
}; //cash_list_filter

var cash_list_edit_btn_add =
{
	xtype: 'button',
	text: 'Добавить',
	id: "cash_list_edit_btn_add",
	icon: "static/ext/resources/themes/images/default/dd/drop-add.gif",
	handler : function (){
		loadScript('static/user/add.js', function() {
		  v_edit_id = 0;
		  cash_list_add.show();
		});
	}
};

var cash_list_tb = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_list_from_date, " ", cash_list_to_date, " ", cash_list_filter, cash_list_filter_loading, '->', cash_list_edit_btn_add],
      region: 'north',
      id: "cash_list_tb",
}; //cash_list_tb

var cash_list_tb_filter = {
  id: "cash_list_tb_filter",
  name: "cash_list_tb_filter",
  xtype: 'toolbar',
  dock: 'top',
  ui: 'footer',
  columns: 2,
  items: [{
            xtype: 'buttongroup',
	    id: "cash_list_tb_filter_bgrp",
	    name: "cash_list_tb_filter_bgrp",
            //title: 'Расширенный фильтр',
	    width: 590,
            columns: 2,
            items:[]
        }],
  region: 'north'
}; //cash_list_tb

function getListAnkhor() {
  var hash = "";
  hash += "act=list";
  hash += "&from=" + Ext.Date.format(Ext.getCmp('cash_list_from_date').getValue(),'Y-m-d');
  hash += "&to=" + Ext.Date.format(Ext.getCmp('cash_list_to_date').getValue(),'Y-m-d');

  if(Ext.getCmp('cash_list_add') != undefined && Ext.getCmp('cash_list_add').isVisible()) {
    if( Ext.getCmp('cash_item_edit_id') != undefined && Ext.getCmp('cash_item_edit_id').getValue() > 0 ) {
      hash += "&item=" + Ext.getCmp('cash_item_edit_id').getValue();
    } else {
      hash += "&item=-1";
    }
  }

  //extend filter
  if(Ext.getCmp('cash_item_nmcl_cb_fltr') != undefined &&
    Ext.getCmp('cash_list_filter').getValue()
  ) {
    hash += "&exfilter=1";
    hash += "&nmcl_id=" + Ext.getCmp('cash_item_nmcl_cb_fltr').getValue();
    hash += "&nmcl_id_no=" + (0+Ext.getCmp('cash_item_nmcl_cb_fltr_no').getValue());
    hash += "&pt_id=" + Ext.getCmp('cash_item_prod_type_cb_fltr').getValue();
    hash += "&pt_id_no=" + (0+Ext.getCmp('cash_item_prod_type_cb_fltr_no').getValue());
    hash += "&price_from=" + (0+Ext.getCmp('cash_item_price_frm_fltr').getValue());
    hash += "&price_to=" + (0+Ext.getCmp('cash_item_price_to_fltr').getValue());
    hash += "&cur_id=" + Ext.getCmp('cash_item_currency_fltr_cb').getValue();
    hash += "&oper_id=" + Ext.getCmp('cash_item_toper_cb_fltr').getValue();
    hash += "&ctype_id=" + Ext.getCmp('cash_item_ctype_fltr_cb').getValue();
    hash += "&org_id=" + Ext.getCmp('cash_item_org_fltr_cb').getValue();
    hash += "&org_id_no=" + (0+Ext.getCmp('cash_item_org_fltr_cb_no').getValue());
    hash += "&note=" + Ext.getCmp('cash_item_note_fltr').getValue();
    hash += "&note_no=" + (0+Ext.getCmp('cash_item_note_fltr_no').getValue());
    hash += "&file=" + (0+Ext.getCmp('cash_item_file_fltr').getValue());
    hash += "&del=" + (0+Ext.getCmp('cash_item_del_fltr').getValue());
  }
  return hash;
}

function setListAnkhorEx(hash, _cb) {
  Ext.Array.each(hash, function(name, index, countriesItSelf) {
    var h = name.split("=");
    if(h.length < 2) return false;
    if( parseInt(h[1]) > 0 ) h[1] = parseInt(h[1]);

    if(h[0] == "nmcl_id") Ext.getCmp('cash_item_nmcl_cb_fltr').setValue(h[1]);
    if(h[0] == "nmcl_id_no") Ext.getCmp('cash_item_nmcl_cb_fltr_no').setValue(h[1]==1);
    if(h[0] == "pt_id") Ext.getCmp('cash_item_prod_type_cb_fltr').setValue(h[1]);
    if(h[0] == "pt_id_no") Ext.getCmp('cash_item_prod_type_cb_fltr_no').setValue(h[1]==1);
    if(h[0] == "price_from") Ext.getCmp('cash_item_price_frm_fltr').setValue(h[1]);
    if(h[0] == "price_to") Ext.getCmp('cash_item_price_to_fltr').setValue(h[1]);
    if(h[0] == "cur_id") Ext.getCmp('cash_item_currency_fltr_cb').setValue(h[1]);
    if(h[0] == "oper_id") Ext.getCmp('cash_item_toper_cb_fltr').setValue(h[1]);
    if(h[0] == "ctype_id") Ext.getCmp('cash_item_ctype_fltr_cb').setValue(h[1]);
    if(h[0] == "org_id") Ext.getCmp('cash_item_org_fltr_cb').setValue(h[1]);
    if(h[0] == "org_id_no") Ext.getCmp('cash_item_org_fltr_cb_no').setValue(h[1]==1);
    if(h[0] == "note") Ext.getCmp('cash_item_note_fltr').setValue(h[1]);
    if(h[0] == "note_no") Ext.getCmp('cash_item_note_fltr_no').setValue(h[1]==1);
    if(h[0] == "file") Ext.getCmp('cash_item_note_fltr_no').setValue(h[1]==1);
    if(h[0] == "del") Ext.getCmp('cash_item_del_fltr').setValue(h[1]==1);

  }); //Ext.Array.each


  if(typeof _cb != undefined) _cb();
}

function setListAnkhor() {
  var p = window.location.hash.split("&");
  if(p.length < 2) return false;
  if(p[0] != "#act=list") return false;

  Ext.Array.each(p, function(name, index, countriesItSelf) {
    var h = name.split("=");
    if(h.length < 2) return false;

    if(h[0] == "from" && h[1] != undefined) Ext.getCmp('cash_list_from_date').setValue(h[1]);
    if(h[0] == "to" && h[1] != undefined) Ext.getCmp('cash_list_to_date').setValue(h[1]);
    if(h[0] == "item")  {
      loadScript('static/user/add.js', function() {
	v_edit_id = parseInt(h[1]);
	if(v_edit_id == undefined || v_edit_id == -1) v_edit_id = 0;
	cash_list_add.show();
      });
    }

    if(h[0] == "exfilter" && h[1] == "1") {
      Ext.getCmp('cash_list_filter_loading').show();
      loadScript("static/user/add.js", function() {
	loadScript("static/user/filter.js", function() {
	  loadFilter(function() {
	    Ext.getCmp('cash_list_tb_filter').show();
	    setListAnkhorEx(p, function() {
	      Ext.getCmp('cash_list_filter').setValue(true);
	      listRefresh();
	      Ext.getCmp('cash_list_filter_loading').hide();
	    }); //setListAnkhorEx
	  }); //loadFilter
	}); //loadScript
      }); //loadScript
    }
  }); //Ext.Array.each

  if(Ext.getCmp('cash_list_from_date').getValue() == null || Ext.getCmp('cash_list_to_date').getValue() == null) setDefaultListVal();

  return true;
}

function setDefaultListVal() {
  Ext.getCmp('cash_list_from_date').setValue(new Date((new Date).getTime() - (3600000*24*7)));
  Ext.getCmp('cash_list_to_date').setValue(new Date());
}


var cash_list_panel = Ext.create('Ext.Panel', {
    frame: true,
    layout: 'border',
    collapsible: false,
    id: "cash_list_panel",
    title: 'Операции',
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [cash_list_tb,cash_list_tb_filter, cash_list_grid],
    listeners: {
	render: function(){
	  Ext.getCmp('cash_list_tb_filter').hide();
	  Ext.getCmp('cash_list_filter_loading').hide();
	},
	activate: function(tab){
	  //setAnkhor();
	  listRefresh();
	}
    }

});//cash_list_panel