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
		login: '',
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
  	/* ENV. TEST */
  	if (this.req.login == 'adm' && this.req.senha == 'adm') {
  		this.navCtrl.push(ChatPage);
  		return;
  	} 

    this.loginProvider.sendPostResquest(this.req).then((result) => {
      if (result['authenticated']) this.navCtrl.push(ChatPage);
  		else this.res = result['originalResponse'] + ' (' + result['msg'] + ')';
      console.log(result);
  	  }, (err) => {
  	    console.log(err);
  	    this.res = 'Falha na requisição';
  	});
  }

}