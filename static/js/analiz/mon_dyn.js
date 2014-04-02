var cash_analiz_mdyn_lbl = {
    id: "cash_analiz_mdyn_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(126)
};


var cash_analiz_mdyn_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_analiz_mdyn_from_date',
    id: 'cash_analiz_mdyn_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_mondyn_refresh
}; // cash_analiz_mdyn_from_date


var cash_analiz_mdyn_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_analiz_mdyn_to_date',
    id: 'cash_analiz_mdyn_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_mondyn_refresh
}; // cash_analiz_mdyn_to_date


var cash_analiz_mdyn_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_mdyn_from_date, " ", cash_analiz_mdyn_to_date],
      region: 'north',
      id: "cash_analiz_mdyn_date"
}; //cash_analiz_mdyn_date


function cash_analiz_mondyn_refresh() {
  if(Ext.getCmp('cash_analiz_mdyn_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_mdyn_to_date').getValue() == null) return;

  cash_analiz_mdyn_store.proxy.url = "ajax/analiz/mon_dyn.php?from=" + Ext.Date.format(Ext.getCmp('cash_analiz_mdyn_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_mdyn_to_date').getValue(),'Y-m-d') + getUsrFltr();
  cash_analiz_mdyn_store.load();
  setAnkhor();
} //cash_analiz_mondyn_refresh

var cash_analiz_mdyn_model = Ext.define('cash_analiz_mdyn_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'tname',		type: 'string'},
      {name: 'in_amount', 	type: 'double'},
      {name: 'out_amount', 	type: 'double'}
    ]
}); //cash_analiz_mdyn_model

var cash_analiz_mdyn_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_mdyn_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/mon_dyn.php?'
    }
}); //cash_analiz_mdyn_store

var cash_analiz_mdyn_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_mdyn_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    shadow: true,
    store: cash_analiz_mdyn_store,
    legend: {
      position: 'right'
    },
    axes: [{
      type: 'Numeric',
      position: 'left',
      fields: ['in_amount', 'out_amount'],
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
      title: lang(82)
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
          field: ['in_amount', 'out_amount'],
          renderer: price_r,
          orientation: 'vertical',
          color: '#333'
      },
      xField: 'tname',
      yField: ['in_amount', 'out_amount'],
      title: [lang(55), lang(54)]
    }]
});


function cash_analiz_mdyn_load(_cb) {
  if(Ext.getCmp('cash_analiz_mondyn').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_mondyn').add(cash_analiz_mdyn_lbl);
  Ext.getCmp('cash_analiz_mondyn').add(cash_analiz_mdyn_date);
  Ext.getCmp('cash_analiz_mondyn').add(cash_analiz_mdyn_chart);

  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_mdyn_from_date').setValue(new Date(cd.getFullYear() - 1, cd.getMonth(), 1));
    Ext.getCmp('cash_analiz_mdyn_to_date').setValue(cd);
  } else {
    setAnalitAnkhorParam();
  }
  cash_analiz_mondyn_refresh();

  if(_cb != undefined) _cb();
}