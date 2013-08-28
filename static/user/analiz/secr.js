var cash_analiz_secr_lbl = {
    id: "cash_analiz_secr_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: 'Финансовая безопасность'
};


var cash_analiz_secr_from_date =
{
    xtype: 'datefield',
    startDay:1,
    fieldLabel: 'Период',
    name: 'cash_analiz_secr_from_date',
    id: 'cash_analiz_secr_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_secr_refresh
}; // cash_analiz_secr_from_date


var cash_analiz_secr_to_date =
{
    xtype: 'datefield',
    fieldLabel: 'по',
    startDay:1,
    name: 'cash_analiz_secr_to_date',
    id: 'cash_analiz_secr_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_secr_refresh
}; // cash_analiz_secr_to_date


var cash_analiz_secr_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_secr_from_date, " ", cash_analiz_secr_to_date],
      region: 'north',
      id: "cash_analiz_secr_date",
}; //cash_analiz_secr_date


function cash_analiz_secr_refresh() {
  if(Ext.getCmp('cash_analiz_secr_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_secr_to_date').getValue() == null) return;

  cash_analiz_secr_store.proxy.url = "ajax/analiz/secr.php?in=1000" +
				    "&out=20000";
  cash_analiz_secr_store.load();
  setAnkhor();
} //cash_analiz_secr_refresh

var cash_analiz_secr_model = Ext.define('cash_analiz_secr_model', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'tname',		type: 'string'},
	{name: 'amount', 	type: 'double'}
    ]
}); //cash_analiz_secr_model

var cash_analiz_secr_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_secr_model',
    autoLoad: false,
    proxy: {
	type: 'ajax',
	url: 'ajax/analiz/mon_dyn.php?'
    }
}); //cash_analiz_secr_store
//

var cash_analiz_secr_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_secr_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    shadow: true,
    store: cash_analiz_secr_store,
    legend: {
      position: 'right'
    },
    axes: [{
	type: 'Numeric',
	position: 'left',
	fields: ['amount'],
	label: {
	    renderer: Ext.util.Format.numberRenderer('0,0')
	},
	title: 'Сумма',
	grid: true,
	minimum: 0
    }, {
	type: 'Category',
	position: 'bottom',
	fields: ['tname'],
	title: 'Месяц'
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
	    field: 'amount',
	    renderer: Ext.util.Format.numberRenderer('0'),
	    orientation: 'vertical',
	    color: '#333'
	},
	xField: 'tname',
	yField: ['amount'],
	title: ['Баланс']
    }]
});


function cash_analiz_secr_load(_cb) {
  if(Ext.getCmp('cash_analiz_secr').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_secr').add(cash_analiz_secr_lbl);
  Ext.getCmp('cash_analiz_secr').add(cash_analiz_secr_date);
  Ext.getCmp('cash_analiz_secr').add(cash_analiz_secr_chart);

  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_secr_from_date').setValue(new Date(cd.getFullYear(), 0, 1));
    Ext.getCmp('cash_analiz_secr_to_date').setValue(cd);
  } else {
    setAnalitAnkhorParam();
  }
  cash_analiz_secr_refresh();

  if(_cb != undefined) _cb();
}