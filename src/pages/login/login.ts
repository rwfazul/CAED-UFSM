import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';

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

  constructor(public navCtrl: NavController, 
  	          public loginProvider: LoginProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
  	console.log(this.req);
  	this.loginProvider.sendPostResquest(this.req).then((result) => {
  	    console.log(result);
  	  }, (err) => {
  	    console.log(err);
  	});
  }

}