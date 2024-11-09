import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/download-video/'; // l'url de mon site backend
  
  constructor(private http:HttpClient ) { }


  // postData(data:any ): Observable<Blob>{
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
  //   const options = { headers, responseType: 'blob' as 'json'}; // Type Blob pour la réponse binaire 


  //   return this.http.post<Blob>(this.apiUrl, data, options).pipe(
  //     catchError(this.handleError) // Gestion des erreurs si nécessaire
  //   );
  // }

  // private handleError(error:HttpErrorResponse) {
  //   let errorMessage = 'Une erreur est survenue';
  //   if (error.error instanceof ErrorEvent){
  //     // Erreur côté client
  //     errorMessage = `Erreur: ${error.error.message}`;
  //   } else {
  //     // Erreur côté serveur
  //     errorMessage = `Erreur serveur: ${error.status}\nMessage: ${error.message}`;

  //   }
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }


  // nouveau section Code pour suvre la progressition du telechargemment

    postDataWithProgress(data:any): Observable<{progress:number, response?: Blob }> {
      return new Observable(observer => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.apiUrl, true);
        xhr.responseType = 'blob'; // Pour recevoire une réponse binaire

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded/ event.total) * 100);
            observer.next({progress});
          };
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            observer.next({progress:100, response: xhr.response});
            observer.complete();
          } else {
            observer.error(`Erreur serveur: ${xhr.status}`)
          }
        };
        xhr.onerror = () => observer.error('Erreur réseau');

        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
      });
    }

}
