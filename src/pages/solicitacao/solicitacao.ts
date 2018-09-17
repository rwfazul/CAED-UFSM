import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the SolicitacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-solicitacao',
  templateUrl: 'solicitacao.html',
})
export class SolicitacaoPage {

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitacaoPage');
  }

}
