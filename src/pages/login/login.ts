import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { ChatPage } from '../chat/chat';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public formLogin : FormGroup;

  public errorMsgs = {
    matriculaRequiredError: 'Por favor, digite sua matrícula',
    matriculaPatternError: 'Mátricula apenas pode conter números',
    senhaRequiredError: 'Por favor, digite sua senha',
    serverResponseError: ''
  }

  constructor(public navCtrl: NavController, 
  	          public loginProvider: LoginProvider,
              private formBuilder: FormBuilder) {
    this.formLogin = this.formBuilder.group({
      login: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      senha: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
    var data = this.formLogin.value;
  	/* ENV. TEST */
  	if (data.login == 'adm' && data.senha == 'adm') {
  		this.navCtrl.setRoot(ChatPage);
  		return;
  	} 

    this.loginProvider.sendPostResquest(data).then((result) => {
      if (result['authenticated']) this.navCtrl.setRoot(ChatPage);
  		else this.errorMsgs.serverResponseError = result['originalResponse'] + ' (' + result['msg'] + ')';
  	  }, (err) => {
  	    this.errorMsgs.serverResponseError = 'Falha na requisição';
  	});
  }

}