//required mod_headers !!!

var cash_analiz_geo_lbl = {
    id: "cash_analiz_geo_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: lang(227)
};


var cash_analiz_geo_from_date =
{
    xtype: 'datefield',
    //startDay:1,
    fieldLabel: lang(43),
    name: 'cash_analiz_geo_from_date',
    id: 'cash_analiz_geo_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_geo_refresh
}; // cash_analiz_geo_from_date


var cash_analiz_geo_to_date =
{
    xtype: 'datefield',
    fieldLabel: lang(44),
    //startDay:1,
    name: 'cash_analiz_geo_to_date',
    id: 'cash_analiz_geo_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_geo_refresh
}; // cash_analiz_geo_to_date

var cash_analiz_geo_in = {
    xtype:      'checkboxfield',
    boxLabel  : lang(118),
    name      : 'cash_analiz_geo_in',
    disabled  : true,
    id        : 'cash_analiz_geo_in',
    onChange: function(newVal, oldVal) {
      cash_analiz_geo_refresh();
    } //onChange
}; //cash_analiz_geo_in


var cash_analiz_geo_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_geo_from_date, " ", cash_analiz_geo_to_date, " ", cash_analiz_geo_in],
      region: 'north',
      id: "cash_analiz_geo_date"
}; //cash_analiz_geo_date


function cash_analiz_geo_refresh() {
  if(Ext.getCmp('cash_analiz_geo_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_geo_to_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_geo_in').disabled) return;

  cash_analiz_geo_store.proxy.url = "ajax/analiz/geo_map.php?in=" + (0+Ext.getCmp('cash_analiz_geo_in').getValue()) +
				    "&from=" + Ext.Date.format(Ext.getCmp('cash_analiz_geo_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_geo_to_date').getValue(),'Y-m-d') + getUsrFltr();
  cash_analiz_geo_store.load(function(records, operation, success) {
    drawMap();
  });
  setAnkhor();
} //cash_analiz_geo_refresh

var map = undefined;
var markers = [];

function drawMap() {
  if(map == undefined) {
    var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("cash_analiz_geo_map"), mapOptions);
  }
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
  markers = [];
  
  var latlng = [];
  cash_analiz_geo_store.each( function(record){
    var tp = record.data.geo_pos.split(";");
    //console.log(record.data);
    var p = new google.maps.LatLng(tp[0], tp[1]);
    latlng.push(p);
    markers.push( 
      new google.maps.Marker({
        position: p,
        map: map,
        title: record.data.date + ". " + record.data.name + " = " + price_r(record.data.amount)
      }) 
    ); //marker
  });
  
  //set center
  var latlngbounds = new google.maps.LatLngBounds();
  latlng.forEach(function(n){
     latlngbounds.extend(n);
  });
  map.setCenter(latlngbounds.getCenter());
  map.fitBounds(latlngbounds);
} //drawMap

var cash_analiz_geo_model = Ext.define('cash_analiz_geo_model', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'geo_pos',	type: 'string'},
      {name: 'name',		type: 'string'},
      {name: 'date',		type: 'string'},
      {name: 'amount',	type: 'double'}
    ]
}); //cash_analiz_geo_model

var cash_analiz_geo_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_geo_model',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      url: 'ajax/analiz/geo_map.php?'
    }
}); //cash_analiz_geo_store

var cash_analiz_geo_map = Ext.create('Ext.Panel', {
    frame: false,
    id: "cash_analiz_geo_map",
    height: h - 100,
    width: w - 50
});//cash_analiz_geo_map


function cash_analiz_geo_load(_cb) {
  if(Ext.getCmp('cash_analiz_geo').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_geo').add(cash_analiz_geo_lbl);
  Ext.getCmp('cash_analiz_geo').add(cash_analiz_geo_date);
  Ext.getCmp('cash_analiz_geo').add(cash_analiz_geo_map);

  if(isDefaultAnaliz()) {
    var cd = new Date();
    Ext.getCmp('cash_analiz_geo_from_date').setValue(new Date(cd.getFullYear(), cd.getMonth(), 1));
    Ext.getCmp('cash_analiz_geo_in').setDisabled(false);
    Ext.getCmp('cash_analiz_geo_in').setValue(false);
    Ext.getCmp('cash_analiz_geo_to_date').setValue(cd);
  } else {
    setAnalitAnkhorParam();
  }

  cash_analiz_geo_refresh();

  if(_cb != undefined) _cb();
}