var cash_goal_model = Ext.define('cash_goal_model', {
    extend: 'Ext.data.Model',
    id: "cash_goal_model",
    fields: [
      {name: 'id', 		  type: 'int'},
      {name: 'db_id',		type: 'int'},
      {name: 'usr_id', 	type: 'int'},
      {name: 'login',	  type: 'string'},
      {name: 'nmcl_id',	type: 'int'},
      {name: 'gname',	  type: 'string'},
      {name: 'plan', 		type: 'number'},
      {name: 'qnt', 		type: 'number'},
      {name: 'plan_date', 		type: 'date', dateFormat : "Y-m-d", submitFormat: 'Y-m-d'},
      {name: 'fact_date', 		type: 'date', dateFormat : "Y-m-d", submitFormat: 'Y-m-d'},
      {name: 'iord', 		type: 'int'},
    ],
    idProperty: 'id'
});

var cash_goal_store = Ext.create('Ext.data.Store', {
    model: 'cash_goal_model',
    id: "cash_goal_store",
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/goal.php'
    }
}); //cash_goal_store

function getPluginGoalSave() {
  if(parseInt(rights.write) != 1) return [];
  return [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit:  1
        })];
}

var cash_goal_add = Ext.create('Ext.button.Button', {
  text: lang(49),
  icon: settings.static + "/add.gif",
  handler : function () {
    cash_goal_store.add({id:0, plan: undefined, qnt:1, plan_date:undefined, iord:undefined});
  }
}); //cash_goal_add

var cash_goal_id_name_model = Ext.define('cash_goal_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id',      type: 'int'},
      {name: 'name',    type: 'string'}
    ],
    idProperty: 'id'
});

var cash_goal_item_nmcl_store = Ext.create('Ext.data.Store', {
  model: 'cash_goal_id_name_model',
  //pageSize: 10,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/nmcl_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_goal_item_nmcl_store

var cash_goal_item_nmcl_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_goal_item_nmcl_store,
    id: "cash_goal_item_nmcl_cb",
    name: "cash_goal_item_nmcl_cb",
    labelWidth: 100,
    displayField: 'name',
    valueField: 'name',
    minChars: 2,
    allowBlank: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>'
}); //cash_goal_item_nmcl_cb


var cash_goal_usr_name_list = Ext.create('Ext.data.Store', {
  model: 'cash_goal_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/analiz/usr_list_analiz.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_goal_usr_name_list

var cash_goal_usr_name_list_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_goal_usr_name_list,
    id: "cash_goal_usr_name_list_cb",
    name: "cash_goal_usr_name_list_cb",
    fieldLabel: lang(30),
    labelWidth: 100,
    editable: false,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    value: uid,
    listeners: {
      select: function( combo, records, e) {
        cash_goal_refresh();
      }
    }
}); //cash_goal_usr_name_list_cb

function cash_goal_refresh() {
  var goal_uid = Ext.getCmp('cash_goal_usr_name_list_cb').getValue();
  var show_fact = Ext.getCmp('cash_goal_show_fact').getValue();
  if(goal_uid == null) goal_uid = uid;
  if(show_fact) show_fact = 1; else show_fact = 0;

  cash_goal_store.proxy.url = "ajax/goal.php?uid=" + goal_uid + "&show_fact="+show_fact;
  cash_goal_store.load();
} //cash_plan_mnth_refresh

var cash_goal_show_fact = {
    xtype:      'checkboxfield',
    boxLabel  : lang(231),
    name      : 'cash_goal_show_fact',
    id        : 'cash_goal_show_fact',
    inputValue: 1,
    width: 120,
    onChange: function(newVal, oldVal) {
      cash_goal_refresh();
    } //onChange
}; //cash_goal_show_fact

var cash_goal_grid = Ext.create('Ext.grid.Panel', {
    store: cash_goal_store,
    id: "cash_goal_grid",
    title: lang(83),
    header: true,
    width: Ext.getBody().getWidth() - 40,
    height: Ext.getBody().getHeight() - 130,
    forceFit: true,
    tbar: [cash_goal_add, "->", cash_goal_show_fact],
    columns: [
      {text: "ID", 		 dataIndex: 'id', 	    hidden: true, 	tdCls: 'x-center-cell', width: 30 },
      {text: lang(84), dataIndex: 'db_id', 	  hidden: true, 	tdCls: 'x-center-cell', width: 30 },
      {text: lang(29), dataIndex: 'usr_id',	  hidden: true, 	tdCls: 'x-center-cell', width: 30 },
      {text: lang(16), dataIndex: 'nmcl_id',	hidden: true, 	tdCls: 'x-center-cell', width: 30	},
      {text: lang(17), dataIndex: 'gname', 	  flex: true, editor: cash_goal_item_nmcl_cb},
      {text: lang(30), dataIndex: 'login',    hidden: false },
      {text: lang(78), dataIndex: 'plan'	,   renderer: price, tdCls: 'x-price-cell', editor: {xtype: 'numberfield', allowBlank: true} },
      {text: lang(21), dataIndex: 'qnt'	,     editor: {xtype: 'numberfield', allowBlank: true}},
      {text: lang(232), dataIndex: 'plan_date'	, renderer: dateRender, field: {xtype: 'datefield', submitFormat: 'Y-m-d', allowBlank: true }},
      {text: lang(233), dataIndex: 'fact_date'	, renderer: dateRender, field: {xtype: 'datefield', submitFormat: 'Y-m-d', allowBlank: true }},
      {text: lang(234), dataIndex: 'iord',  editor: {xtype: 'numberfield', allowBlank: true} },
      {
          menuDisabled: true,
          sortable: false,
          hideable: false,
          xtype: 'actioncolumn',
          id: "cash_goal_edit_col",
          width: 110,
          items: [{
                  icon: settings.static + "/finish.png",
                  tooltip: lang(235),
                  handler: function(grid, rowIndex, colIndex) {
                      if(parseInt(rights.write) == 0) return;
                      loadMask_cash_goal_grid.show();

                      var rec = grid.getStore().getAt(rowIndex);

                      Ext.Ajax.request({
                        url: "ajax/finish_goal.php",
                        method: "GET",
                        params: {
                          id: rec.get('id')
                        },
                        success: function(data) {
                            if(parseInt(data.responseText) > 0) {
                              cash_goal_store.load();
                            } else {
                              error(data.responseText);
                            }
                            loadMask_cash_goal_grid.hide();
                        },//success
                        failure: function(response) {
                            error(response.statusText);
                            loadMask_cash_goal_grid.hide();
                        }//failure
                      }); //Ext.Ajax.request
                  }
                }, " ", {
                  icon: settings.static + "/yes.gif",
                  tooltip: lang(79),
                  handler: function(grid, rowIndex, colIndex) {
                      if(parseInt(rights.write) == 0) return;
                      loadMask_cash_goal_grid.show();

                      var rec = grid.getStore().getAt(rowIndex);

                      Ext.Ajax.request({
                        url: "ajax/save_goal.php",
                        method: "POST",
                        params: rec.data,
                        success: function(data) {
                            if(parseInt(data.responseText) > 0) {
                              cash_goal_store.load();
                            } else {
                              error(data.responseText);
                            }
                            loadMask_cash_goal_grid.hide();
                            grid.getStore().getAt(rowIndex);
                        },//success
                        failure: function(response) {
                            error(response.statusText);
                            loadMask_cash_goal_grid.hide();
                        }//failure
                      }); //Ext.Ajax.request
                  }
                }, " ", {
                iconCls: 'del-cash-col',
                tooltip: lang(37),
                handler: function(grid, rowIndex, colIndex) {
                  if(parseInt(rights.write) == 0) return;
                  Ext.Msg.show({
                      title: lang(236),
                      msg: lang(236),
                      buttons: Ext.Msg.YESNO,
                      icon: Ext.Msg.QUESTION,
                      fn: function(id) {
                        if(id == 'yes') {
                          loadMask_cash_goal_grid.show();
                  
                          var rec = grid.getStore().getAt(rowIndex);
                          //rec.get('id')
                          if(rec.get('id') == 0) {
                            cash_goal_store.remove(rec);
                          } else {
                            Ext.Ajax.request({
                              url: "ajax/del_goal.php",
                              method: "GET",
                              params: {
                                id: rec.get('id')
                              },
                              success: function(data) {
                                  if(parseInt(data.responseText) > 0) {
                                    cash_goal_store.load();
                                  } else {
                                    error(data.responseText);
                                  }
                                  loadMask_cash_goal_grid.hide();
                              },//success
                              failure: function(response) {
                                  error(response.statusText);
                                  loadMask_cash_goal_grid.hide();
                              }//failure
                            }); //Ext.Ajax.request
                          }
                          loadMask_cash_goal_grid.hide();
                        } //yes
                      } //fn
                  }); //Ext.Msg.show
                } //handler
              }]
      }
    ],
    selType: 'cellmodel',
    plugins: getPluginGoalSave()
}); //cash_goal_grid

var loadMask_cash_goal_grid = new Ext.LoadMask(cash_goal_grid, {msg: lang(80), store: cash_goal_store});
