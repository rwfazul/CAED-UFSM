import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json',
  })
};

@Injectable()
export class LoginProvider {

  // private apiUrl = 'http://caedusfm.herokuapp.com';

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

  sendPostResquest(data) {
	  return new Promise((resolve, reject) => {	  	
	    this.http.post('/authenticate', JSON.stringify(data), httpOptions)
	      .subscribe(res => {
	        resolve(res);
	      }, (err) => {
	        reject(err);
	      });
	  });
  }

}