import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //private apiUrl = 'https://downloadytbackend-production.up.railway.app/download-video/'; // l'url de mon site backend
  private apiUrl = 'http://127.0.0.1:8000'
  
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

    postDataWithProgress(data:any): Observable<{progress: number; response?: Blob; headers?:{[key:string]: string} }> {
      return new Observable(observer => {
        const xhr = new XMLHttpRequest();
        xhr.setRequestHeader('Content-Type', 'application/json');

        // Initialisation de la requête
        xhr.open('POST', this.apiUrl, true);
        xhr.responseType = 'blob'; // Pour recevoire une réponse binaire

        // Evénement de progression pour le suivi du pourcentage de la requête
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded/ event.total) * 100);
            observer.next({progress});
          }
        };

      // Quand la requête est terminée
        xhr.onload = () => {
          
          if (xhr.status === 200) {
            
            // Récupérer les en-têtê importtans
            const headers: { [key: string]: string } = {};
            const headerString = xhr.getAllResponseHeaders();
            
            // Afficher les en-têtes pour le débogage
            console.log('En-têtes de la réponse:', headerString);
            headerString.split('\r\n').forEach(headerLine => {
              const [key, value] = headerLine.split(': ');
              if (key && value){
                headers[key.trim()] = value.trim();
              }
            });

            observer.next({progress:100, response: xhr.response, headers});
            observer.complete();
          } else {
            observer.error(`Erreur serveur: ${xhr.status}`)
          }
        };

        // Gérer les erreurs réseau
        xhr.onerror = () => {
          observer.error('Erreur réseau');
        };

        // Assurez-vous que lesen-tête sont correctement configurés pour un envoi JSON
        xhr.setRequestHeader('Content-Type', 'application/json')
        // Envoi des données sous form JSON
        xhr.send(JSON.stringify(data));
        // Assurez-vous que l'Observable est bien géré
        return () => {
          if (xhr.readyState !== 4) {
            xhr.abort(); // Annule la requête si l'Observable est terminé ou annulé avant que la requête ne soit complète
          }
        };
      });
    }

}
