var cash_analiz_secr_lbl = {
    id: "cash_analiz_secr_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(130)
};

var cash_analiz_secr_amnt =
{
    xtype: 'numberfield',
    fieldLabel: lang(131),
    name: 'cash_analiz_secr_amnt',
    id: 'cash_analiz_secr_amnt',
    minValue: 0,
    width: 300,
    labelWidth: 200,
    colspan: 3,
    onChange: cash_analiz_secr_refresh
};


var cash_analiz_secr_in =
{
    xtype: 'numberfield',
    fieldLabel: lang(132),
    name: 'cash_analiz_secr_in',
    id: 'cash_analiz_secr_in',
    minValue: 0,
    width: 300,
    labelWidth: 200,
    onChange: cash_analiz_secr_refresh
};

var cash_analiz_secr_in_proc = Ext.create('Ext.slider.Single', {
    width: 450,
    id: 'cash_analiz_secr_in_proc',
    fieldLabel: lang(133),
    labelWidth: 150,
    value: 0,
    increment: 0.5,
    minValue: 0,
    maxValue: 100,
    listeners: {
      changecomplete: function(slider, newValue, thumb, eOpts) {
          cash_analiz_secr_refresh();
      }
    }
});

var cash_analiz_secr_in_proc_qnt =
{
    xtype: 'textfield',
    name: 'cash_analiz_secr_in_proc_qnt',
    id: 'cash_analiz_secr_in_proc_qnt',
    width: 43,
    value: "0%",
    disabled: true
};

var cash_analiz_secr_out_proc_qnt =
{
    xtype: 'textfield',
    name: 'cash_analiz_secr_out_proc_qnt',
    id: 'cash_analiz_secr_out_proc_qnt',
    width: 43,
    value: "0%",
    disabled: true
};


var cash_analiz_secr_out_proc = Ext.create('Ext.slider.Single', {
    width: 450,
    id: 'cash_analiz_secr_out_proc',
    fieldLabel: lang(134),
    labelWidth: 150,
    value: 0,
    increment: 0.5,
    minValue: 0,
    maxValue: 100,
    listeners: {
      changecomplete: function(slider, newValue, thumb, eOpts) {
          cash_analiz_secr_refresh();
      }
    }
});


var cash_analiz_secr_out =
{
    xtype: 'numberfield',
    fieldLabel: lang(135),
    name: 'cash_analiz_secr_out',
    id: 'cash_analiz_secr_out',
    minValue: 0,
    width: 300,
    labelWidth: 200,
    onChange: cash_analiz_secr_refresh
};

var cash_analiz_secr_inout_frm = Ext.create('Ext.Panel', {
    id: "cash_analiz_secr_inout_frm",
    frame: true,
    layout: {
        type: 'table',
        columns: 3
    },
    width: w-100,
    items: [cash_analiz_secr_amnt,
	    cash_analiz_secr_in, cash_analiz_secr_in_proc, cash_analiz_secr_in_proc_qnt,
	    cash_analiz_secr_out, cash_analiz_secr_out_proc, cash_analiz_secr_out_proc_qnt]
});//cash_analiz_secr_inout



var cash_analiz_secr_amount = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      width: w-100,
      items: [cash_analiz_secr_inout_frm],
      region: 'north',
      id: "cash_analiz_secr_amount"
}; //cash_analiz_secr_date


function cash_analiz_secr_refresh() {
  if(Ext.getCmp('cash_analiz_secr_in').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_secr_out').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_secr_amnt').getValue() == null) return;

  Ext.getCmp('cash_analiz_secr_in_proc_qnt').setValue(Ext.getCmp('cash_analiz_secr_in_proc').getValue()+"%");
  Ext.getCmp('cash_analiz_secr_out_proc_qnt').setValue(Ext.getCmp('cash_analiz_secr_out_proc').getValue()+"%");

  cash_analiz_secr_store.proxy.url = "ajax/analiz/secr.php?amount="+Ext.getCmp('cash_analiz_secr_amnt').getValue() +
				     "&in=" + Ext.getCmp('cash_analiz_secr_in').getValue() +
				     "&out=" + Ext.getCmp('cash_analiz_secr_out').getValue() +
				     "&proc_in=" + Ext.getCmp('cash_analiz_secr_in_proc').getValue() +
				     "&proc_out=" + Ext.getCmp('cash_analiz_secr_out_proc').getValue() + getUsrFltr();
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
      title: lang(22),
      grid: true/*,
      minimum: -10000*/
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
          field: 'amount',
          renderer: price_r,
          orientation: 'vertical'
          //color: '#fff'
      },
      xField: 'tname',
      yField: ['amount'],
      title: [lang(87)]
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
      url: "ajax/analiz/avg_inout.php?1" + getUsrFltr(),
      method: "GET",
      success: function(data) {
          var obj = Ext.decode(data.responseText);
          Ext.getCmp('cash_analiz_secr_amnt').setValue(obj[0]);
          if(typeof obj[1][0] != "undefined") {
            Ext.getCmp('cash_analiz_secr_out').setValue(obj[1][0].avg_amount);
          } else {
            Ext.getCmp('cash_analiz_secr_out').setValue(0);
          }
          if(typeof obj[1][1] != "undefined") {
            Ext.getCmp('cash_analiz_secr_in').setValue(obj[1][1].avg_amount);
          } else {
            Ext.getCmp('cash_analiz_secr_in').setValue(0);
          }
      }//success
    }); //Ext.Ajax.request

  } else {
    setAnalitAnkhorParam();
    cash_analiz_secr_refresh();
  }

  if(_cb != undefined) _cb();
}