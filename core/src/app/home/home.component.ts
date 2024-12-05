import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatProgressBarModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})
export class HomeComponent {
      errorRequete = false;
      loadVideoError = false;
      searchControl: FormControl;
      load:boolean = false; // Variable pour verifier si l'etat de requete avant d'activer le loader
      loadVideo: boolean = false; // Variale pour verifier si la video vas commencer le téléchargement ou pas
      thumbnailUrl: string = ''; // si il y'a un thumbnail alors la réquete est bonne ont afficher image plus button de téléchargmenet
      title: string = '';
      dots = Array(5); // Représente 5 points
      isAnimating = true;
      success = false;
      messageError: string = '';
      progress = 0;
      isDisable:boolean = false;


     


      constructor( private apiService:ApiService){
        // Creation de FormControl pour serveiller les evenement dans le champs
        this.searchControl = new FormControl('');
        this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(value=>{

              this.errorRequete = false
              this.load = !this.load // Activer la bar de téléchagement 
              const data = {"video_url": value} // Donné envoyer au serveur backend

              // Ecouter la progression
              this.apiService.progress$.subscribe((progressValue) =>{
                this.progress = progressValue;
              })

              // Lancer le téléchargement 
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
        this.isDisable = !this.isDisable // Deactiver le button pour attendre que le téléchargemnt se termine
        this.loadVideo = !this.loadVideo;
        this.loadVideoError = false;

        const data = {"video_url": this.searchControl.value};

        this.apiService.downloadVideo(data).subscribe({
          next: response => { 
            if(this.progress !== 0){
              this.loadVideo = false;
            }
            if(this.progress === 100){
              
              this.isDisable = !this.isDisable // Activer le button une foie le téléchargement terminé 
            }
            
            
          },
          error: err => {
            this.loadVideo = false;
            this.loadVideoError = !this.loadVideoError;
            this.messageError = `echec de téléchargement verifier la connexion`

          }
        })
      }

}
