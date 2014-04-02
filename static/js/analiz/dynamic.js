var cash_analiz_dyn_lbl = {
    id: "cash_analiz_dyn_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(119)
};


var cash_analiz_dyn_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_analiz_dyn_from_date',
    id: 'cash_analiz_dyn_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_dyn_refresh
}; // cash_analiz_dyn_from_date


var cash_analiz_dyn_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_analiz_dyn_to_date',
    id: 'cash_analiz_dyn_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_dyn_refresh
}; // cash_analiz_dyn_to_date


var cash_analiz_dyn_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      cls: "cash_analiz_date",
      items: [cash_analiz_dyn_from_date, " ", cash_analiz_dyn_to_date],
      region: 'north',
      id: "cash_analiz_dyn_date"
}; //cash_analiz_dyn_date


function cash_analiz_dyn_refresh() {
  if(Ext.getCmp('cash_analiz_dyn_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_dyn_to_date').getValue() == null) return;

  cash_analiz_dyn_store.proxy.url = "ajax/analiz/dynamic.php?from=" + Ext.Date.format(Ext.getCmp('cash_analiz_dyn_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_dyn_to_date').getValue(),'Y-m-d') + getUsrFltr();
  cash_analiz_dyn_store.load();
  setAnkhor();
} //cash_analiz_com_refresh

var cash_analiz_dyn_model = Ext.define('cash_analiz_com_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'tdate',		type: 'string'},
      {name: 'in_data',	type: 'double'},
      {name: 'out_data',	type: 'double'},
      {name: 'dif_data',	type: 'double'}
    ]
}); //cash_analiz_com_model

var cash_analiz_dyn_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_com_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/dynamic.php?'
    }
}); //cash_analiz_com_store

var cash_analiz_dyn_chart = Ext.create('Ext.chart.Chart', {
    width: w - 100,
    height: h - 100,
    id: "cash_analiz_dyn_chart",
    animate: true,
    store: cash_analiz_dyn_store,
    shadow: true,
    theme: 'Base',
    legend: {
      position: 'right'
    },
    axes: [{
      type: 'Numeric',
      position: 'left',
      fields: ['in_data', 'out_data', 'dif_data'],
      title: lang(22),
      minorTickSteps: 1,
      grid: {
          odd: {
            opacity: 1,
            fill: '#ddd',
            stroke: '#bbb',
            'stroke-width': 0.5
          }
      }
    }, {
      type: 'Category',
      position: 'bottom',
      fields: ['tdate'],
      title: lang(23)
    }],
    series: [{
      type: 'line',
      highlight: {
          size: 7,
          radius: 7
      },
      tips: {
        trackMouse: true,
        width: 290,
        height: 28,
        renderer: function(storeItem, item) {
          this.setTitle(lang(120) + storeItem.get('tdate') + ": " + price_r(storeItem.get('in_data')));
        }
      },
      axis: 'left',
      smooth: true,
      xField: 'tdate',
      yField: 'in_data',
      title: lang(55),
      style: {
          stroke: '#94ae0a'
      },
      markerConfig: {
          type: 'circle',
          fill: '#94ae0a',
          stroke: '#94ae0a',
          size: 4,
          radius: 4,
          'stroke-width': 0
      }
    }, {
      type: 'line',
      highlight: {
          size: 7,
          radius: 7
      },
      tips: {
        trackMouse: true,
        width: 290,
        height: 28,
        renderer: function(storeItem, item) {
          this.setTitle(lang(121) + storeItem.get('tdate') + ": " + price_r(storeItem.get('out_data')));
        }
      },
      axis: 'left',
      smooth: true,
      xField: 'tdate',
      yField: 'out_data',
      title: lang(54),
      style: {
          stroke: '#a61120'
      },
      markerConfig: {
          type: 'circle',
          size: 4,
          radius: 4,
          fill: '#a61120',
          stroke: '#a61120',
          'stroke-width': 0
      }
    }, {
      type: 'line',
      highlight: {
          size: 7,
          radius: 7
      },
      tips: {
        trackMouse: true,
        width: 290,
        height: 28,
        renderer: function(storeItem, item) {
          this.setTitle(lang(122) + storeItem.get('tdate') + ": " + price_r(storeItem.get('dif_data')));
        }
      },
      title: lang(87),
      axis: 'left',
      smooth: true,
      //fill: true,
      xField: 'tdate',
      yField: 'dif_data',
      style: {
          stroke: '#115fa6'
      },
      markerConfig: {
          type: 'circle',
          size: 4,
          fill: '#115fa6',
          stroke: '#115fa6',
          radius: 4,
          'stroke-width': 0
      }
    }]
});




function cash_analiz_dyn_load(_cb) {
  if(Ext.getCmp('cash_analiz_dyn').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_dyn').add(cash_analiz_dyn_lbl);
  Ext.getCmp('cash_analiz_dyn').add(cash_analiz_dyn_date);
  Ext.getCmp('cash_analiz_dyn').add(cash_analiz_dyn_chart);

  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_dyn_from_date').setValue(new Date(cd.getFullYear(), cd.getMonth(), 1));
    Ext.getCmp('cash_analiz_dyn_to_date').setValue(cd);
  } else {
    setAnalitAnkhorParam();
  }
  cash_analiz_dyn_refresh();

  if(_cb != undefined) _cb();
}