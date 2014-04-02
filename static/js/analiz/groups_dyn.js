var cash_analiz_grp_dyn_chart = {};

var cash_analiz_grp_dyn_lbl = {
    id: "cash_analiz_grp_dyn_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(124)
};


var cash_analiz_grp_dyn_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_analiz_grp_dyn_from_date',
    id: 'cash_analiz_grp_dyn_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_group_dyn_refresh
}; // cash_analiz_grp_dyn_from_date


var cash_analiz_grp_dyn_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_analiz_grp_dyn_to_date',
    id: 'cash_analiz_grp_dyn_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_group_dyn_refresh
}; // cash_analiz_grp_dyn_to_date

var cash_analiz_grp_dyn_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_grp_dyn_from_date, " ", cash_analiz_grp_dyn_to_date],
      region: 'north',
      id: "cash_analiz_grp_dyn_date"
}; //cash_analiz_grp_dyn_date

var cash_analiz_grp_dyn_model = Ext.define('cash_analiz_grp_dyn_model', {
    extend: 'Ext.data.Model',
    fields: []
}); //cash_analiz_grp_dyn_model

var cash_analiz_grp_dyn_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_grp_dyn_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/groups_dyn.php?'
    }
}); //cash_analiz_grp_dyn_store

var cash_analiz_grp_dyn_chart_prm =
{
  id: "cash_analiz_grp_dyn_chart",
  width: w - 100,
  height: h - 100,
  animate: true,
  store: cash_analiz_grp_dyn_store,
  shadow: true,
  legend: {
      position: 'bottom'
  },
  axes: [{
      type: 'Numeric',
      position: 'left',
      fields: [],
      title: lang(89),
      grid: {
          odd: {
              opacity: 1,
              fill: '#ddd',
              stroke: '#bbb',
              'stroke-width': 1
          }
      },
      minimum: 0,
      adjustMinimumByMajorUnit: 1
  }, {
      type: 'Category',
      position: 'bottom',
      fields: ['name'],
      title: lang(125),
      grid: true,
      label: {
          rotate: {
              degrees: 315
          }
      }
  }],
  series: [{
      type: 'area',
      highlight: true,
      axis: 'left',
      xField: 'name',
      yField: [],
      style: {
          opacity: 0.93
      },
      tips: {
        trackMouse: true,
        width: 250,
        height: 28,
        renderer: function(storeItem, item) {
          this.setTitle(storeItem.get('name') + ", " + item.storeField + ", " + price_r(item.storeItem.data[item.storeField]));
        }
      }
  }]
};

function cash_analiz_group_dyn_refresh() {
  if(Ext.getCmp('cash_analiz_grp_dyn_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_grp_dyn_to_date').getValue() == null) return;
  
  var url = "ajax/analiz/groups_dyn.php" + 
            "?from=" + Ext.Date.format(Ext.getCmp('cash_analiz_grp_dyn_from_date').getValue(),'Y-m-d') +
            "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_grp_dyn_to_date').getValue(),'Y-m-d') + getUsrFltr();
  
  if( cash_analiz_grp_dyn_store.proxy.url != url ) {
    reloadParam(function() {
      cash_analiz_grp_dyn_store.proxy.url = url;
      cash_analiz_grp_dyn_store.load(function() {
        //setAnalitAnkhorParam();
      });
      setAnkhor();
    });
  }
} //cash_analiz_group_dyn_refresh

function reloadParam(_cb) {
  Ext.Ajax.request({
      url: "ajax/analiz/groups_dyn.php?gr=1" +
              "&from=" + Ext.Date.format(Ext.getCmp('cash_analiz_grp_dyn_from_date').getValue(),'Y-m-d') +
              "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_grp_dyn_to_date').getValue(),'Y-m-d'),
      method: "GET",
      success: function(data) {
        var gr = Ext.decode(data.responseText);
        var gr_names = [];
        cash_analiz_grp_dyn_model.prototype.fields.clear();
        cash_analiz_grp_dyn_model.prototype.fields.add(Ext.create('Ext.data.Field', {name: 'name',	type: 'string'}));
        for(var i = 0; i < gr.length; ++i) {
          gr_names.push(gr[i].name);
          cash_analiz_grp_dyn_model.prototype.fields.add(Ext.create('Ext.data.Field', {name: gr[i].name, type: 'double'}));
        }
        
        if(Ext.getCmp('cash_analiz_grp_dyn_chart') != undefined) {
          Ext.getCmp('cash_analiz_grp_dyn_chart').destroy();
          cash_analiz_grp_dyn_chart = {};
        }
        cash_analiz_grp_dyn_chart_prm.axes[0].fields = gr_names;
        cash_analiz_grp_dyn_chart_prm.series[0].yField = gr_names;
        cash_analiz_grp_dyn_chart = Ext.create('Ext.chart.Chart', cash_analiz_grp_dyn_chart_prm);
        Ext.getCmp('cash_analiz_group_dyn').add(cash_analiz_grp_dyn_chart);
        
        if(_cb != undefined) _cb();
    } //success
  }); //Ext.Ajax.request
}

function cash_analiz_grp_dyn_load(_cb) {
  if(Ext.getCmp('cash_analiz_group_dyn').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }
  Ext.getCmp('cash_analiz_group_dyn').add(cash_analiz_grp_dyn_lbl);
  Ext.getCmp('cash_analiz_group_dyn').add(cash_analiz_grp_dyn_date);
  
  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_grp_dyn_from_date').setValue(new Date(cd.getFullYear() - 1, cd.getMonth(), 1));
    Ext.getCmp('cash_analiz_grp_dyn_to_date').setValue(cd);
    cash_analiz_group_dyn_refresh();
  } else {
    setAnalitAnkhorParam();
    cash_analiz_group_dyn_refresh();
  }
  
  if(_cb != undefined) _cb();
}