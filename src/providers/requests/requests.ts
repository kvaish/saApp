import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RequestsProvider {

  constructor(public http: Http) {
    console.log('Hello RequestsProvider Provider');
  }

  getRequests(state,agentid){
    console.log(state);
    console.log(agentid);
    return this.http.get('http://54.174.46.232:3000/getAssignedRequests/'+state+'/'+agentid).map(res=>res.json());
  }
  rejectRequest(id:any, state:any, status: any){
    return this.http.get('http://54.174.46.232:3000/updateRequest/'+id+'/'+state+'/'+status).map(res=>res.json());
  }

  updateRequest(id:any, state:any, status: any, remarks: any){
    return this.http.get('http://54.174.46.232:3000/updateRequest/'+id+'/'+state+'/'+status+'/'+remarks).map(res=>res.json());
  }
}
