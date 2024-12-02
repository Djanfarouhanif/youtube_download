import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 private apiUrlVideo = 'http://127.0.0.1:8000/download-video/';
 private apiUrlData  = 'http://127.0.0.1:8000/video-data/'; 
      constructor( private http:HttpClient){}

      // Fonction pour télécharger la video
      downloadVideo(data:any):Observable<any>{

        return this.http.post(this.apiUrlVideo, data , {responseType: "blob"})
      }

      // Fonction pour recuper le titre et la minature
      getData(data:any):Observable<any>{
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        })
        return this.http.post(this.apiUrlData, data, {headers})
      }



}
