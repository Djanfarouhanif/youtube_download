import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})
export class HomeComponent {
      errorRequete = false;
      loadVideoError = false;
      searchControl: FormControl;
      load:boolean = false; // Variable pour verifier si l'etat de requete avant d'activer le loader
      loadVideo: boolean = false; // Variale pour verifier si la video vas commencer le téléchargement ou pas
      thumbnailUrl: string = 'j';
      title: string = '';
      dots = Array(5); // Représente 5 points
      isAnimating = true;


     


      constructor( private apiService:ApiService){
        // Creation de FormControl pour serveiller les evenement dans le champs
        this.searchControl = new FormControl('');
        this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
              this.errorRequete = false
              this.load = !this.load // Activer la bar de téléchagement 
              const data = {"video_url": value} // Donné envoyer au serveur backend
              this.apiService.getData(data).subscribe({
                next: response => {
                  this.load = false;
                  this.title = response.success.title ;
                  this.thumbnailUrl = response.success.Thumbnail
                },
                error: err => {
                  this.load = false; // Bloque l'evenment avant de d'afficher le message d'erreur
                  this.errorRequete = !this.errorRequete; 
                }
              });
          
        });
      };
      // Fonction pour appeller la requete et recuper la video
      download(){
        this.loadVideo = !this.loadVideo;
        this.loadVideoError = false;

        const data = {"video_url": this.searchControl.value};

        this.apiService.downloadVideo(data).subscribe({
          next: response => { 
            this.loadVideo = false;
            console.log("success");
          },
          error: err => {
            this.loadVideo = false;
            this.loadVideoError = !this.loadVideoError;

          }
        })
      }

}
