var cash_analiz_grp_lbl = {
    id: "cash_analiz_grp_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(123)
};


var cash_analiz_grp_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_analiz_grp_from_date',
    id: 'cash_analiz_grp_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_group_refresh
}; // cash_analiz_grp_from_date


var cash_analiz_grp_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_analiz_grp_to_date',
    id: 'cash_analiz_grp_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_group_refresh
}; // cash_analiz_grp_to_date

var cash_analiz_grp_in = {
    xtype:      'checkboxfield',
    boxLabel  : lang(118),
    name      : 'cash_analiz_grp_in',
    id        : 'cash_analiz_grp_in',
    disabled  : true,
    onChange: function(newVal, oldVal) {
      cash_analiz_group_refresh();
    } //onChange
}; //cash_analiz_grp_in


var cash_analiz_grp_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_grp_from_date, " ", cash_analiz_grp_to_date, " ", cash_analiz_grp_in],
      region: 'north',
      id: "cash_analiz_grp_date"
}; //cash_analiz_grp_date


function cash_analiz_group_refresh() {
  if(Ext.getCmp('cash_analiz_grp_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_grp_to_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_grp_in').disabled) return;

  cash_analiz_grp_store.proxy.url = "ajax/analiz/groups.php?in=" + (0+Ext.getCmp('cash_analiz_grp_in').getValue()) +
				    "&from=" + Ext.Date.format(Ext.getCmp('cash_analiz_grp_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_grp_to_date').getValue(),'Y-m-d') + getUsrFltr();
  cash_analiz_grp_store.load(function() {
    //setAnalitAnkhorParam();
  });
  setAnkhor();
} //cash_analiz_group_refresh

var cash_analiz_grp_model = Ext.define('cash_analiz_grp_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'tname',		type: 'string'},
      {name: 'out_amount',	type: 'double'}
    ]
}); //cash_analiz_grp_model

var cash_analiz_grp_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_grp_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/groups.php?'
    }
}); //cash_analiz_grp_store

var cash_analiz_grp_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_grp_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    store: cash_analiz_grp_store,
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
      tips: {
        trackMouse: true,
        width: 220,
        height: 28,
        renderer: function(storeItem, item) {
          var total = 0;
          cash_analiz_grp_store.each(function(rec) {
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


function cash_analiz_grp_load(_cb) {
  if(Ext.getCmp('cash_analiz_group').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_group').add(cash_analiz_grp_lbl);
  Ext.getCmp('cash_analiz_group').add(cash_analiz_grp_date);
  Ext.getCmp('cash_analiz_group').add(cash_analiz_grp_chart);


  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_grp_from_date').setValue(new Date(cd.getFullYear(), cd.getMonth(), 1));
    Ext.getCmp('cash_analiz_grp_in').setDisabled(false);
    Ext.getCmp('cash_analiz_grp_in').setValue(false);
    Ext.getCmp('cash_analiz_grp_to_date').setValue(cd);
    cash_analiz_group_refresh();
  } else {
    setAnalitAnkhorParam();
    cash_analiz_group_refresh();
  }

  if(_cb != undefined) _cb();
}