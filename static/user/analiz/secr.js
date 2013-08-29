var cash_analiz_secr_lbl = {
    id: "cash_analiz_secr_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: 'Финансовая безопасность'
};


var cash_analiz_secr_in =
{
    xtype: 'numberfield',
    fieldLabel: 'Средений месячный приход',
    name: 'cash_analiz_secr_in',
    id: 'cash_analiz_secr_in',
    minValue: 0,
    value: 0,
    width: 300,
    labelWidth: 200,
    onChange: cash_analiz_secr_refresh
};


var cash_analiz_secr_out =
{
    xtype: 'numberfield',
    fieldLabel: 'Средний месячный расход',
    name: 'cash_analiz_secr_out',
    id: 'cash_analiz_secr_out',
    minValue: 0,
    value: 0,
    width: 300,
    labelWidth: 200,
    onChange: cash_analiz_secr_refresh
};


var cash_analiz_secr_amount = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_secr_in, " ", cash_analiz_secr_out],
      region: 'north',
      id: "cash_analiz_secr_amount",
}; //cash_analiz_secr_date


function cash_analiz_secr_refresh() {
  if(Ext.getCmp('cash_analiz_secr_in').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_secr_out').getValue() == null) return;

  cash_analiz_secr_store.proxy.url = "ajax/analiz/secr.php?in=" + Ext.getCmp('cash_analiz_secr_in').getValue() +
				    "&out=" + Ext.getCmp('cash_analiz_secr_out').getValue();
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
	url: 'ajax/analiz/secr.php?'
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
	    renderer: price_r
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
	    renderer: price_r,
	    orientation: 'vertical',
	    color: '#fff'
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
  Ext.getCmp('cash_analiz_secr').add(cash_analiz_secr_amount);
  Ext.getCmp('cash_analiz_secr').add(cash_analiz_secr_chart);

  if(isDefaultAnaliz()) {
    Ext.Ajax.request({
	url: "ajax/analiz/avg_inout.php",
	method: "GET",
	success: function(data) {
	    var obj = Ext.decode(data.responseText);
	    Ext.getCmp('cash_analiz_secr_in').setValue(obj[1].avg_amount);
	    Ext.getCmp('cash_analiz_secr_out').setValue(obj[0].avg_amount);
	}//success
    }); //Ext.Ajax.request

  } else {
    setAnalitAnkhorParam();
    cash_analiz_secr_refresh();
  }

  if(_cb != undefined) _cb();
}