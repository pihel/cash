var cash_list_model = Ext.define('cash_list_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		        type: 'int'},
      {name: 'nmcl_id', 	    type: 'int'},
      {name: 'nom', 		      type: 'string'},
      {name: 'group', 	      type: 'int'},
      {name: 'gname', 	      type: 'string'},
      {name: 'price', 	      type: 'number'},
      {name: 'qnt', 		      type: 'number'},
      {name: 'amount', 	      type: 'number'},
      {name: 'oper_date',	    type: 'date', dateFormat : "Y-m-d"},
      {name: 'date_edit',     type: 'date', dateFormat: "Y-m-d H:i:s"},
      {name: 'org_id', 	      type: 'int'},
      {name: 'oname', 	      type: 'string'},
      {name: 'type', 		      type: 'int'},
      {name: 'note',		      type: 'string'},
      {name: 'file', 		      type: 'string'},
      {name: 'uid', 		      type: 'int'},
      {name: 'login', 	      type: 'string'},
      {name: 'rate', 		      type: 'number'},
      {name: 'sign', 		      type: 'string'},
      {name: 'cash_type_id', 	type: 'int'},
      {name: 'cash_type', 	  type: 'string'}
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

Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+10006060247) //7 days from now
}));

var cash_list_grid = Ext.create('Ext.grid.Panel', {
    store: cash_list_store,
    columns: [
      {text: "ID", 		 dataIndex: 'id', 		      hidden: true, 	tdCls: 'x-center-cell' },
      {text: lang(16), dataIndex: 'nmcl_id', 		  hidden: true , 	tdCls: 'x-center-cell'},
      {text: lang(17), dataIndex: 'nom', 		      flex: 1, 	hideable: false},
      {text: lang(18), dataIndex: 'group', 		    hidden: true , 	tdCls: 'x-center-cell'},
      {text: lang(19), dataIndex: 'gname',		    hideable: true },
      {text: lang(20), dataIndex: 'price',		    hideable: false, renderer: price, tdCls: 'x-price-cell' },
      {text: lang(21), dataIndex: 'qnt',		      hideable: false, summaryType: 'sum', tdCls: 'x-center-cell' },
      {text: lang(22), dataIndex: 'amount',		    hideable: true,  renderer: price_r, summaryType: 'sum' , tdCls: 'x-amount-cell' , summaryRenderer: price },
      {text: lang(23), dataIndex: 'oper_date',	  hideable: true, renderer: dateRender, tdCls: 'x-center-cell'  },
      {text: lang(24), dataIndex: 'date_edit', 	  hidden: true,   renderer: dateTimeRender, tdCls: 'x-center-cell' },
      {text: lang(25), dataIndex: 'org_id', 		  hidden: true, 	tdCls: 'x-center-cell' },
      {text: lang(26), dataIndex: 'oname',		    hideable: true },
      {text: lang(27), dataIndex: 'type', 		    hidden: true , 	tdCls: 'x-center-cell'},
      {text: lang(28), dataIndex: 'file',		      hidden: true },
      {text: lang(29), dataIndex: 'uid', 		      hidden: true, 	tdCls: 'x-center-cell' },
      {text: lang(30), dataIndex: 'login', 	      hidden: false },
      {text: lang(31), dataIndex: 'rate', 		    hidden: true },
      {text: lang(32), dataIndex: 'sign',		      hidden: true },
      {text: lang(33), dataIndex: 'cash_type_id', hidden: true, 	tdCls: 'x-center-cell' },
      {text: lang(34), dataIndex: 'cash_type', 	  hidden: true, 	tdCls: 'x-center-cell' },
      {text: lang(35), dataIndex: 'note', 		    flex: 1 },
      {
            menuDisabled: true,
            sortable: false,
            draggable: false,
            hideable: false,
            xtype: 'actioncolumn',
            width: 80,
            id: "cash_list_edit_col",
            items: [{
              iconCls: 'copy-cash-col',
              tooltip: lang(193) + ' (C)',
              handler: function(grid, rowIndex, colIndex) {
                  var rec = grid.getStore().getAt(rowIndex);
                  copyItem(rec.get('id'));
              }
            }, {
              iconCls: 'edit-cash-col',
              tooltip: lang(36) + ' (Enter, Dbl click)',
              handler: function(grid, rowIndex, colIndex) {
                  var rec = grid.getStore().getAt(rowIndex);
                  editItem(rec.get('id'));
              }
            }, {
              iconCls: 'del-cash-col',
              tooltip: lang(37) + ' (Del)',
              handler: function(grid, rowIndex, colIndex) {
                  var rec = grid.getStore().getAt(rowIndex);
                  deleteItem(rec.get('id'));
              }
            }]
        }
    ],
    //stateful: true, //bug
    //stateId: 'cash_list_grid_state',
    listeners: {
      cellkeydown: function( obj, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var key = e.getKey();
        if(key == Ext.EventObject.ENTER) {
          editItem(record.get('id'));
        } else if(key == Ext.EventObject.DELETE) {
          deleteItem(record.get('id'));
        } else if(key == Ext.EventObject.C) {
          copyItem(record.get('id'));
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
      menuFilterText: lang(38),
      filters: [
        {dataIndex: 'id', 		    type: 'int'},
        {dataIndex: 'nmcl_id', 		type: 'int'},
        {dataIndex: 'nom', 		    type: 'string'},
        {dataIndex: 'group', 		  type: 'int'},
        {dataIndex: 'gname', 		  type: 'string'},
        {dataIndex: 'price', 		  type: 'numeric'},
        {dataIndex: 'qnt', 		    type: 'numeric'},
        {dataIndex: 'amount', 		type: 'numeric'},
        {dataIndex: 'oper_date'	},
        {dataIndex: 'date_edit'	},
        {dataIndex: 'org_id', 		type: 'int'},
        {dataIndex: 'oname', 		  type: 'string'},
        {dataIndex: 'type', 		  type: 'int'},
        {dataIndex: 'note',		    type: 'string'},
        {dataIndex: 'file', 		  type: 'string'},
        {dataIndex: 'uid', 		    type: 'int'},
        {dataIndex: 'login', 		  type: 'string'},
        {dataIndex: 'rate', 		  type: 'numeric'},
        {dataIndex: 'sign', 		  type: 'string'},
        {dataIndex: 'cash_type_id', 	type: 'int'},
        {dataIndex: 'cash_type', 	type: 'string'}]
    }],
    region:'center'
}); //cash_list_grid

var loadMask_cash_list_grid = new Ext.LoadMask(cash_list_grid, {msg:lang(39), store: cash_list_store});

function checkWriteSec(v_id) {
  if( parseInt(settings.secure_user) == 1 ) {
    if( cash_list_store.findRecord("id", v_id).get('uid') != uid ) {
      return false;
    }
  }  
  return true;
} //checkWriteSec

function editItem(v_id) {
  if(parseInt(rights.write) == 0) return;
  if(!checkWriteSec(v_id)) return;
  
  loadScript('static/js/add.js', function() {
    v_edit_id = v_id;
    v_copy = false;
    cash_list_add.show();
  });
}

function copyItem(v_id) {
  if(parseInt(rights.write) == 0) return;
  loadScript('static/js/add.js', function() {
    v_edit_id = v_id;
    v_copy = true;
    cash_list_add.show();
  });
}


function deleteItem(v_id) {
  if(parseInt(rights.write) == 0) return;
  if(!checkWriteSec(v_id)) return;
  
  Ext.Msg.show({
      title:lang(40),
      msg: lang(41),
      icon: Ext.MessageBox.QUESTION,
      buttons: Ext.Msg.OKCANCEL,
      fn: function(buttonId) {
        //if clicked ok
        if(buttonId == "ok") {
            cash_list_grid.setLoading(lang(42));
            Ext.Ajax.request({
              url: "ajax/delete.php",
              method: "GET",
              params: {
                id: v_id
              },
              success: function(data) {
                // if response is not empty - error msg
                if(parseInt(data.responseText) != 1) {
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
    //startDay:1,
    fieldLabel: lang(43),
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
    fieldLabel: lang(44),
    //startDay:1,
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
    cash_list_store.proxy.url += "&uid=" + (0+parseInt(Ext.getCmp('cash_item_user_cb_fltr').getValue()));
    cash_list_store.proxy.url += "&file=" + (0+Ext.getCmp('cash_item_file_fltr').getValue());
    cash_list_store.proxy.url += "&del=" + (0+Ext.getCmp('cash_item_del_fltr').getValue());
  }


  cash_list_store.load(function(e) {  
    if(typeof _cb == "function") {
      _cb(e);
    } else {
      cash_list_grid.getView().focus();
      cash_list_grid.getSelectionModel().select(cash_list_store.last());
    }
  });

  setAnkhor();
}

/*var cash_list_refresh =
{
	xtype: 'button',
	text: 'Обновить',
	icon: "ext/resources/themes/images/default/grid/refresh.gif",
	tooltip: 'Перегрузить список с новыми параметрами',
	border: true,
      	cls: "x-btn-default-small",
	handler : listRefresh
}*/

var cash_list_filter_loading = Ext.create('Ext.Img', {
    src: settings.static + '/loading_small.gif',
    id: 'cash_list_filter_loading',
    name: "cash_list_filter_loading",
    mode: 'element',
    title: lang(45),
    style: {
      //display: "none",
      margin: "1px 0px 0px 5px"
    }
});//w_img

var cash_list_filter = {
    xtype:      'checkboxfield',
    boxLabel  : lang(46),
    name      : 'cash_list_filter',
    inputValue: '0',
    id        : 'cash_list_filter',
    onChange: function(newVal, oldVal) {
      if(newVal && Ext.getCmp('cash_list_tb_filter').isVisible()) return;
      Ext.getCmp('cash_list_filter_loading').show();
      loadScript(settings.static + "/js/add.js", function() {
        loadScript(settings.static + "/js/filter.js", function() {
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

var cash_list_edit_btn_add_check =
{
	xtype: 'filefield',
	buttonText: lang(47),
  tooltip: lang(47),
	id: "cash_list_edit_btn_add_check",
  buttonOnly: true,
  buttonConfig: {
      text: lang(47),
      iconCls: 'cash_list_edit_btn_add_check_ico'
  },
  listeners: {
    change: function( o, value, eOpts ){
      cash_list_edit_btn_ocr_check.submit({
          waitTitle: lang(4),
          waitMsg: lang(48),
          success: function(form, action) {
            addCheck(action.result.msg);
          },
          failure: function(form, action) {
            error(action.result.msg);
          }
      }); //cash_list_edit_btn_ocr_check
    }
  }
};

var cash_list_edit_btn_ocr_check = new Ext.FormPanel({
  url:'ajax/ocr_check.php',
  bodyPadding: 0,
  id: "cash_list_edit_btn_ocr_check",
  frame: false,
  border: false,
  items: [cash_list_edit_btn_add_check ]
}); //cash_list_edit_btn_ocr_check

var cash_list_edit_btn_add =
{
	xtype: 'button',
	text: lang(49),
  tooltip: lang(50) + " (Insert)",
	id: "cash_list_edit_btn_add",
	icon: settings.static + "/add.gif",
	handler : function (){
    addItem();
	}
};

function addCheck(hash) {
  if(parseInt(rights.write) == 0) return;
  loadScript('static/js/check.js', function() {
    v_edit_id = 0;
    v_copy = false;
    v_hash = hash;
    cash_list_check.show();
  });
}

function addItem() {
  if(parseInt(rights.write) == 0) return;
  loadScript('static/js/add.js', function() {
    v_edit_id = 0;
    v_copy = false;
    cash_list_add.show();
  });
}

var cash_list_tb = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_list_from_date, " ", cash_list_to_date, " ", cash_list_filter, cash_list_filter_loading, '->', cash_list_edit_btn_ocr_check, " ", cash_list_edit_btn_add],
      region: 'north',
      id: "cash_list_tb"
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
    hash += "&uid=" + Ext.getCmp('cash_item_user_cb_fltr').getValue();
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
    if(h[0] == "uid") Ext.getCmp('cash_item_user_cb_fltr').setValue(h[1]);
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
      loadScript('static/js/add.js', function() {
        v_edit_id = parseInt(h[1]);
        v_copy = false;
        if(v_edit_id == undefined || v_edit_id == -1) v_edit_id = 0;
        cash_list_add.show();
      });
    }

    if(h[0] == "exfilter" && h[1] == "1") {
      Ext.getCmp('cash_list_filter_loading').show();
      loadScript(settings.static + "/js/add.js", function() {
        loadScript(settings.static + "/js/filter.js", function() {
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
    tabConfig: {
      title: lang(51),
      tooltip: lang(51) + ' (Alt-1)'
    },
    height: Ext.getBody().getHeight() - 50,
    header: true,
    items: [cash_list_tb,cash_list_tb_filter, cash_list_grid],
    listeners: {
      render: function(){
        Ext.getCmp('cash_list_tb_filter').hide();
        Ext.getCmp('cash_list_filter_loading').hide();
        
        var map = new Ext.util.KeyMap(document, {
              key: [Ext.EventObject.INSERT], // extjs5: Ext.event.Event.INSERT (4: Ext.EventObject.INSERT)
              fn: function() { 
                if( Ext.getCmp('cash_list_tabs').getActiveTab().id == "cash_list_panel" ) {
                  addItem();
                }
              }
          }
        );
      },
      activate: function(tab){
        //setAnkhor();
        listRefresh();
      }
    }

});//cash_list_panel