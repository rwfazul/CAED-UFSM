import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SolicitacaoPage } from '../solicitacao/solicitacao';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pages: Array<{title: string, component: any, icon: String}>;

  constructor(public navCtrl: NavController) {

    this.pages = [
      { title: 'Conversar com alguém', component: LoginPage, icon: "chatbubbles"  },
      { title: 'Solicitar atendimento', component: SolicitacaoPage, icon: "create"}, 
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page.component);
  }

}
