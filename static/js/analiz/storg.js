var amount = 0;

var cash_analiz_strg_lbl = {
    id: "cash_analiz_strg_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(136)
};

var cash_analiz_storg_amount = {
    xtype: 'numberfield',
    id: "cash_analiz_storg_amount",
    name: "cash_analiz_storg_amount",
    fieldLabel: lang(137),
    allowBlank: false,
    labelWidth: 100,
    width: 200,
    allowBlank: false,
    value: 1000000,
    listeners: {
      change: function( o, newValue, oldValue, eOpts ) {
        var dt = Ext.Date.add(new Date(), Ext.Date.YEAR, 1);
        Ext.util.Cookies.set("cash_analiz_storg_amount", newValue, dt );
        cash_analiz_rest_refresh();
      }
    }
};//cash_analiz_storg_amount

var cash_analiz_storg = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_storg_amount],
      region: 'north',
      id: "cash_analiz_storg"
}; //cash_analiz_storg


function cash_analiz_rest_refresh() {
  var amount = Ext.getCmp('cash_analiz_storg_amount').getValue();
  cash_analiz_strg_store.proxy.url = 'ajax/analiz/storg.php?amount=' + amount + getUsrFltr()
  cash_analiz_strg_store.load();
  setAnkhor();
} //cash_analiz_rest_refresh

var cash_analiz_strg_model = Ext.define('cash_analiz_strg_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'tname',		type: 'string'},
      {name: 'out_amount',	type: 'double'}
    ]
}); //cash_analiz_strg_model

var cash_analiz_strg_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_strg_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/storg.php?'
    }
}); //cash_analiz_strg_store

var cash_analiz_strg_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_strg_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    store: cash_analiz_strg_store,
    shadow: true,
    legend: {
      position: 'right'
    },
    insetPadding: 60,
    theme: 'Base:gradients',
    series: [{
      type: 'pie',
      field: 'out_amount',
      showInLegend: true,
      donut: false,
      colorSet: ['#94ae0a', '#a61120'],
      tips: {
        trackMouse: true,
        width: 250,
        height: 28,
        renderer: function(storeItem, item) {
          var total = 0;
          cash_analiz_strg_store.each(function(rec) {
            total += rec.get('out_amount');
          });
          this.setTitle(storeItem.get('tname') + ' ('+price_r(storeItem.get('out_amount'))+'): ' + Math.round(storeItem.get('out_amount') / total * 100) + '%');
        }
      },
      highlight: {
        segment: {
          margin: 20
        }
      },
      label: {
          field: 'tname',
          display: 'rotate',
          contrast: true,
          font: '18px Arial',
          renderer: function (value, label, storeItem) { return value + ' ('+price_r(storeItem.get('out_amount'))+')'; }
      }
    }]
});


function cash_analiz_strg_load(_cb) {
  if(Ext.getCmp('cash_analiz_rest').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }
  
  amount = parseInt( Ext.util.Cookies.get("cash_analiz_storg_amount") );
  
  if(amount > 0) {
    cash_analiz_storg_amount.value = amount;
  }
  
  Ext.getCmp('cash_analiz_rest').add(cash_analiz_strg_lbl);
  Ext.getCmp('cash_analiz_rest').add(cash_analiz_storg);
  Ext.getCmp('cash_analiz_rest').add(cash_analiz_strg_chart);  
  cash_analiz_rest_refresh();

  if(_cb != undefined) _cb();
}