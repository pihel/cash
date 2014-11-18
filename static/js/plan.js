var cash_plan_model = Ext.define('cash_plan_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id', 		  type: 'int'},
      {name: 'db_id',		type: 'int'},
      {name: 'usr_id', 	type: 'int'},
      {name: 'grp_id',	type: 'int'},
      {name: 'name',	  type: 'string'},
      {name: 'plan', 		type: 'number'}
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

function getPluginPlanSave() {
  if(parseInt(rights.write) != 1) return [];
  return [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit:  1
        })];
}

var cash_plan_grid = Ext.create('Ext.grid.Panel', {
    store: cash_plan_store,
    id: "cash_plan_grid",
    title: lang(77),
    header: true,
    width: Ext.getBody().getWidth() - 30,
    height: Ext.getBody().getHeight()/3,
    forceFit: true,
    columns: [
      {text: "ID", 		 dataIndex: 'id', 	    hidden: true, 	tdCls: 'x-center-cell', width: 30 },
      {text: lang(84), dataIndex: 'db_id', 	  hidden: true, 	tdCls: 'x-center-cell', width: 30 },
      {text: lang(29), dataIndex: 'usr_id',	  hidden: true, 	tdCls: 'x-center-cell', width: 30 },
      {text: lang(18), dataIndex: 'grp_id',	  width: 75	},
      {text: lang(19), dataIndex: 'name', 	  flex: true	},
      {text: lang(78), dataIndex: 'plan'	,   editor: {xtype: 'numberfield', allowBlank: true}},
      {
          menuDisabled: true,
          sortable: false,
          hideable: false,
          xtype: 'actioncolumn',
          id: "cash_plan_edit_col",
          width: 30,
          items: [ {
            icon: settings.static + "/yes.gif",
            tooltip: lang(79),
            handler: function(grid, rowIndex, colIndex) {
                if(parseInt(rights.write) == 0) return;

                var rec = grid.getStore().getAt(rowIndex);

                Ext.Ajax.request({
                  url: "ajax/save_plan.php",
                  method: "POST",
                  params: rec.data,
                  success: function(data) {
                      if(parseInt(data.responseText) > 0) {
                        cash_plan_store.load();
                      } else {
                        error(data.responseText);
                      }
                  }//success
                }); //Ext.Ajax.request
            }
          }]
      }
    ],
    selType: 'cellmodel',
    plugins: getPluginPlanSave()
}); //cash_plan_grid

var loadMask_cash_plan_grid = new Ext.LoadMask(cash_plan_grid, {msg: lang(80), store: cash_plan_store});

//-----



var cash_plan_mnth_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_plan_mnth_from_date',
    id: 'cash_plan_mnth_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_plan_mnth_refresh
}; // cash_plan_mnth_from_date


var cash_plan_mnth_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_plan_mnth_to_date',
    id: 'cash_plan_mnth_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_plan_mnth_refresh
}; // cash_plan_mnth_to_date


var cash_plan_mnth_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_plan_mnth_from_date, " ", cash_plan_mnth_to_date],
      region: 'north',
      id: "cash_plan_mnth_date"
}; //cash_plan_mnth_date


function cash_plan_mnth_refresh() {
  if(Ext.getCmp('cash_plan_mnth_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_plan_mnth_to_date').getValue() == null) return;

  cash_plan_mnth_store.proxy.url = "ajax/plan_amount.php?from=" + Ext.Date.format(Ext.getCmp('cash_plan_mnth_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_plan_mnth_to_date').getValue(),'Y-m-d');
  cash_plan_mnth_store.load();
} //cash_plan_mnth_refresh

var cash_plan_mnth_model = Ext.define('cash_plan_mnth_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'tname',	type: 'string'},
      {name: 'plan', 	type: 'number'},
      {name: 'fact', 	type: 'number'}
    ]
}); //cash_plan_mnth_model

var cash_plan_mnth_store = Ext.create('Ext.data.Store', {
    model: 'cash_plan_mnth_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/plan_amount.php?'
    }
}); //cash_plan_mnth_store

var cash_plan_mnth_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_plan_mnth_chart",
    width: Ext.getBody().getWidth() - 20,
    height: Ext.getBody().getHeight()/3*2 - 120,
    animate: true,
    shadow: true,
    store: cash_plan_mnth_store,
    legend: {
      position: 'right'
    },
    axes: [{
      type: 'Numeric',
      position: 'left',
      fields: ['plan', 'fact'],
      label: {
          renderer: price_r
      },
      title: lang(22),
      grid: true,
      minimum: 0
    }, {
      type: 'Category',
      position: 'bottom',
      fields: ['tname'],
      title: lang(19)
    }],
    series: [{
      type: 'column',
      axis: 'left',
      highlight: true,
      tips: {
        trackMouse: true,
        width: 220,
        height: 28,
        renderer: function(storeItem, item) {
          this.setTitle(storeItem.get('tname') + ': ' + price_r(storeItem.get(item.yField)) );
        }
      },
      label: {
        display: 'insideEnd',
        'text-anchor': 'middle',
          field: ['plan', 'fact'],
          renderer: price_r,
          orientation: 'vertical',
          color: '#333'
      },
      xField: 'tname',
      yField: ['plan', 'fact'],
      title: [lang(78), lang(81)]
    }]
});


var cash_plan_panel = Ext.create('Ext.Panel', {
    id: "cash_plan_panel",
    border: false,
    title: lang(82),
    frame: true,
    items: [cash_plan_grid, cash_plan_mnth_date, cash_plan_mnth_chart],
    listeners: {
      afterrender: function(){
        Ext.getCmp('cash_plan_edit_col').setVisible(parseInt(rights.write) == 1);
        cash_plan_store.load();
        var cd = new Date();
        Ext.getCmp('cash_plan_mnth_from_date').setValue(new Date(cd.getFullYear(), cd.getMonth(), 1));
        Ext.getCmp('cash_plan_mnth_to_date').setValue(cd);
      }
    }

});//cash_plan_panel

var cash_plan_goal_panel = Ext.create('Ext.Panel', {
    id: "cash_plan_goal_panel",
    border: false,
    frame: true,
    disabled: true,
    title: lang(83),
    items: [],
    listeners: {
      afterrender: function(){
        loadScript(settings.static + "/js/goal.js", function() {
          Ext.getCmp('cash_plan_goal_panel').add(Ext.getCmp('cash_goal_grid'));
        }); //loadScript
      } //afterrender
    }
});//cash_plan_goal_panel

var cash_plan_tabs = Ext.widget('tabpanel', {
    id: "cash_plan_tabs",
    border: false,
    items: [cash_plan_panel, cash_plan_goal_panel]
});