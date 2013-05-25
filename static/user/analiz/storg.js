var cash_analiz_strg_lbl = {
    id: "cash_analiz_strg_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: 'Накопления'
};


function cash_analiz_strg_refresh() {
  cash_analiz_strg_store.load();
  setAnkhor();
} //cash_analiz_strg_refresh

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
	    this.setTitle(storeItem.get('tname') + ': ' + Math.round(storeItem.get('out_amount') / total * 100) + '%');
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
	    font: '18px Arial'
	}
    }]
});


function cash_analiz_strg_load(_cb) {
  if(Ext.getCmp('cash_analiz_rest').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_rest').add(cash_analiz_strg_lbl);
  Ext.getCmp('cash_analiz_rest').add(cash_analiz_strg_chart);
  cash_analiz_strg_refresh();

  if(_cb != undefined) _cb();
}