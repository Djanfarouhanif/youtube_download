import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Pour la production
  // private apiUrlVideo = 'http://127.0.0.1:8000/download-video/';
  // private apiUrlData = 'http://127.0.0.1:8000/video-data/';

  // POUR LE DEPLOYEMENT
   private apiUrlVideo = 'https://downloadytbackend-production.up.railway.app/download-video/';
   private apiUrlData = 'https://downloadytbackend-production.up.railway.app/video-data/';

  private progressSubject = new Subject<number>(); // Pour suivre la progression

  constructor(private http: HttpClient) {}

  get progress$(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  // Fonction pour télécharger la video
  downloadVideo(data: any, title: string): Observable<any> {
    return this.http
      .post(this.apiUrlVideo, data, {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        tap((event) => {
          switch (event.type) {
            case HttpEventType.DownloadProgress:
              if (event.total) {
                const percentDone = Math.round(
                  (100 * event.loaded) / event.total
                );
                this.progressSubject.next(percentDone); // Emet la progression
              }
              break;
            case HttpEventType.Response:
              if (event instanceof HttpResponse) {
                this.progressSubject.next(100); // Indique que le traitement terminé

                const blob = new Blob([event.body!], { type: 'video/mp4' }); // Crée un blob video
                const url = window.URL.createObjectURL(blob); // Crée un url pour la video
                const a = document.createElement('a'); // Crée un lien
                a.href = url;
                a.download = title;
                document.body.appendChild(a);
                a.click(); // Télécharge le fichier
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // Libére l'URL Blob
              }
              break;
          }
        })
      );
  }

  // Fonction pour recuper le titre et la minature
  getData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrlData, data, { headers });
  }
}
