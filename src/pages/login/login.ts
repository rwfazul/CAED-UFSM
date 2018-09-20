import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { ChatPage } from '../chat/chat';

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

  private req = {
		appName: 'UFSMDigital',
		deviceId: '',
		deviceInfo: '',
		login: '',
		messageToken: '',
		senha: ''
  }

  public res = '';

  constructor(public navCtrl: NavController, 
  	          public loginProvider: LoginProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
  	/* TEST ENV */
  	if (this.req.login == 'adm' && this.req.senha == 'adm') {
  		this.navCtrl.push(ChatPage);
  		return;
  	} 
    this.loginProvider.sendPostResquest(this.req).then((result) => {
  		if (!result['error']) this.navCtrl.push(ChatPage);
  		else this.res = this.res = 'Matrícula ou Senha inválidas';
  	  }, (err) => {
  	    console.log(err);
  	    this.res = 'Falha na requisição';
  	});
  }

}