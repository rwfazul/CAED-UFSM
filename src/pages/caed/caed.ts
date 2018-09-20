import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CaedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-caed',
  templateUrl: 'caed.html',
})
export class CaedPage {

  caed: Array<{icon: String, url: String}>;
  nucleo: Array<{icon: String, url: String}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.caed = [
      {icon: "home", url: "http://coral.ufsm.br/caed/"}, 
      {icon: "logo-facebook", url: "https://www.facebook.com/caedufsm/"}
    ];

    this.nucleo = [
      {icon: "home", url: "http://coral.ufsm.br/anima/"}, 
      {icon: "logo-facebook", url: "https://www.facebook.com/N%C3%BAcleo-de-Apoio-%C3%A0-Aprendizagem-UFSM-894880297286164/"}      
    ]
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaedPage');
  }

}
