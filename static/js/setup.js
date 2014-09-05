var setup_id_name_model = Ext.define('setup_id_name_model', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',      type: 'INT'},
        {name: 'name',    type: 'text'}
    ],
    idProperty: 'id'
});


var setup_lang_list = Ext.create('Ext.data.Store', {
  model: 'setup_id_name_model',
  autoDestroy: true,
  proxy: {
      // load using HTTP
      type: 'ajax',
      url: 'ajax/langs.php',
      reader: {
        type: 'json'
      }
  }
}); //setup_lang_list


var setup_passw = {
  xtype: 'textfield',
  fieldLabel:lang(214),
  name:'password',
  id: "password",
  inputType:'password',
  width: 250,
  labelWidth: 130,
  allowBlank:false
};

var setup_lang_list_cb = Ext.create('Ext.form.field.ComboBox', {
    store: setup_lang_list,
    id: "setup_lang_list_cb",
    name: "setup_lang_list_cb",
    fieldLabel:lang(224),
    editable: false,
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    allowBlank: false,
    value: 0,
    width: 200,
    labelWidth: 130,
    listConfig: {
         itemTpl: Ext.create('Ext.XTemplate', '<div><img src="'+settings.static+'/{name}.png" class="setup_flag"/>{name}</div>')
    },
    listeners: {
      select: function( combo, records, e) {
        var dt = Ext.Date.add(new Date(), Ext.Date.YEAR, 1);
        Ext.util.Cookies.set("LANG", records[0].get('name'), dt );
        
        window.location.reload();
      }
    }
}); //setup_lang_list_cb

function submt() {
  if(Ext.getCmp('password').getValue() == "") return;
  var form = Ext.getCmp('setupForm').getForm();
  form.submit({
      waitTitle: lang(4),
      waitMsg: lang(216),
      success: function(form, action) {
        Ext.Msg.show({
          title: lang(213),
          msg: action.result.msg,
          buttons: Ext.Msg.OK,
          fn: function() {
            window.location.reload()
          }
        });
      },
      failure: function(form, action) {
        error(action.result.msg, function() {
          Ext.getCmp('password').focus(false, 100);
        });        
      }
  });
}

var setupForm = new Ext.FormPanel({
  url:'ajax/setup.php',
  bodyPadding: 5,
  id: "setupForm",
  frame: true,
  items: [setup_passw, setup_lang_list_cb],
  listeners: {
    afterRender: function(thisForm, options){
        this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
            enter: submt,
            scope: this
        });
    }
  },
  buttons: [
      {
        text: lang(215),
        formBind: true,
        disabled: true,
        handler: function() {
            submt();
        }
      }
  ]
});

var setupWindow = new Ext.Window({
  frame:true,
  border: false,
  title: lang(213),
  width: 290,
  closable: false,
  resizable: false,
  items: setupForm,
  listeners: {
    show: function(){
      setup_lang_list.load();
    }
  }
});