var cash_analiz_org_lbl = {
    id: "cash_analiz_org_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(127)
};


var cash_analiz_org_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_analiz_org_from_date',
    id: 'cash_analiz_org_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_org_refresh
}; // cash_analiz_org_from_date


var cash_analiz_org_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_analiz_org_to_date',
    id: 'cash_analiz_org_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_org_refresh
}; // cash_analiz_org_to_date

//---- prod type list
var cash_analiz_org_id_name_model = Ext.define('cash_analiz_org_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'id',      type: 'INT'},
      {name: 'name',    type: 'text'}
    ],
    idProperty: 'id'
});

var cash_analiz_org_prod_type_store = Ext.create('Ext.data.Store', {
  model: 'cash_analiz_org_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/prod_type_list.php',
      reader: {
        type: 'json'
      }
  }
}); //cash_analiz_org_prod_type_store

var cash_analiz_org_prod_type_cb = Ext.create('Ext.form.field.ComboBox', {
    store: cash_analiz_org_prod_type_store,
    id: "cash_analiz_org_prod_type_cb",
    name: "cash_analiz_org_prod_type_cb",
    fieldLabel: lang(19),
    labelWidth: 50,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: true,
    width: 450,
    editable: false,
    tpl: '<tpl for="."><div class="x-boundlist-item">{name:htmlEncode}</div></tpl>',
    doQuery: function(queryString, forceAll) {
        this.expand();
        this.store.clearFilter(true);
        this.store.filter(this.displayField, new RegExp(Ext.String.escapeRegex(queryString), 'i'));
        Ext.getCmp('cash_analiz_org_prod_type_cb').focus(false, 1);
    },
	onChange: cash_analiz_org_refresh
}); //cash_analiz_org_prod_type_cb



var cash_analiz_org_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_org_from_date, " ", cash_analiz_org_to_date, " ", cash_analiz_org_prod_type_cb],
      region: 'north',
      id: "cash_analiz_org_date"
}; //cash_analiz_org_date


function cash_analiz_org_refresh() {
  if(Ext.getCmp('cash_analiz_org_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_org_to_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_org_prod_type_cb').getValue() == null) return;

  cash_analiz_org_store.proxy.url = "ajax/analiz/orgs.php?from=" + Ext.Date.format(Ext.getCmp('cash_analiz_org_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_org_to_date').getValue(),'Y-m-d') +
            "&gr=" + (0+Ext.getCmp('cash_analiz_org_prod_type_cb').getValue()) + getUsrFltr();
  cash_analiz_org_store.load();
  setAnkhor();
} //cash_analiz_org_refresh

var cash_analiz_org_model = Ext.define('cash_analiz_org_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'tname',		type: 'string'},
      {name: 'out_amount',	type: 'double'}
    ]
}); //cash_analiz_org_model

var cash_analiz_org_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_org_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/orgs.php?'
    }
}); //cash_analiz_org_store

var cash_analiz_org_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_org_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    store: cash_analiz_org_store,
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
          cash_analiz_org_store.each(function(rec) {
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


function cash_analiz_org_load(_cb) {
  if(Ext.getCmp('cash_analiz_org').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_org').add(cash_analiz_org_lbl);
  Ext.getCmp('cash_analiz_org').add(cash_analiz_org_date);
  Ext.getCmp('cash_analiz_org').add(cash_analiz_org_chart);

  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_org_from_date').setValue(new Date(cd.getFullYear(), cd.getMonth(), 1));
    Ext.getCmp('cash_analiz_org_to_date').setValue(cd);
    cash_analiz_org_prod_type_store.load(function() {
      cash_analiz_org_prod_type_store.insert(0,  Ext.data.Record({id:0,name:lang(128)}));
          cash_analiz_org_prod_type_cb.setValue(0);
          cash_analiz_org_refresh();
          if(_cb != undefined) _cb();
    });
  } else {
    cash_analiz_org_prod_type_store.load(function() {
      cash_analiz_org_prod_type_store.insert(0,  Ext.data.Record({id:0,name:lang(128)}));
          setAnalitAnkhorParam();
          cash_analiz_org_refresh();
          if(_cb != undefined) _cb();
    });	
  }
}