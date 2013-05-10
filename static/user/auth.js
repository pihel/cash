var loginForm = new Ext.FormPanel({
  url:'ajax/login.php',
  bodyPadding: 5,
  frame: true,
  items: [
      {
	  xtype: 'textfield',
	  id: 'login',
	  name: 'login',
	  fieldLabel: 'Имя',
	  allowBlank:false,
	  anchor: '90%'
      },{
	  xtype: 'textfield',
	  fieldLabel:'Пароль',
	  name:'password',
	  inputType:'password',
	  anchor: '90%',
	  allowBlank:false
      }
  ],

  buttons: [
      {
	text: 'Войти',
	formBind: true,
        disabled: true,
	handler: function() {
	    var form = this.up('form').getForm();
	    form.submit({
		waitTitle: 'Пожалуйста подождите...',
		waitMsg: 'Вход в систему выполняется',
		success: function(form, action) {
		    authOk(action.result.msg);
		},
		failure: function(form, action) {
		    error(action.result.msg);
		}
	    });
	}
      }
  ]
});

var loginWindow = new Ext.Window({
  frame:true,
  border: false,
  title:'Вход в бухгалтерию',
  width:330,
  closable: false,
  items: loginForm
});