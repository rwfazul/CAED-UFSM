import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8'
  })
};

@Injectable()
export class LoginProvider {

  private apiUrl = 'https://portal.ufsm.br';

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

  sendPostResquest(data) {
	  return new Promise((resolve, reject) => {	  	
	    this.http.post(this.apiUrl + '/mobile/webservice/generateToken', JSON.stringify(data), httpOptions)
	      .subscribe(res => {
	        resolve(res);
	      }, (err) => {
	        reject(err);
	      });
	  });
  }

}