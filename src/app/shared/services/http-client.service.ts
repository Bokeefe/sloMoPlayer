// angular
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

// rxjs
import {catchError} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import {_throw} from '../../../../node_modules/rxjs/observable/throw';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpClientService {
  constructor(private http: HttpClient) { }
  private baseUrl: string = window.location.origin;


  public GET(url: string): Observable<any> {
    const token = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    return this.http.get(this.baseUrl + url, options)
      .pipe(
        map((res) => {
            return res;
          }
        ),
        catchError((error) => {
            return _throw(error);
          }
        )
      );
  }

  public POST(url, formData: Object): Observable<any>{
    return this.http.post(this.baseUrl + url, formData)
      .pipe(
        map((res) => {
            return res;
          }
        ),
        catchError((error) => {
            return _throw(error);
          }
        )
      );
  }
}
