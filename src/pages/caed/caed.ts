import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CaedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-caed',
  templateUrl: 'caed.html',
})
export class CaedPage {

  links: Array<{icon: String, url: String}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.links = [
      {icon: "home", url: "http://coral.ufsm.br/caed/" }, 
      {icon: "logo-facebook", url: "https://www.facebook.com/caedufsm/" }  
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaedPage');
  }

}
