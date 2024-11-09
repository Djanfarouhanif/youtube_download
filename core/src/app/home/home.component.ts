import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})
export class HomeComponent {
    
  formulaire:FormGroup
  progression: number = 0;

  constructor(private apiService:ApiService, private formBuilder: FormBuilder){
     this.formulaire = this.formBuilder.group({
       video_url: ['', Validators.required] // Champ "video_url" avec validation requise
     });
   }

  //  enyoyerData(){
  //   const video_url = this.formulaire.get('video_url')?.value;
  //   console.log(video_url)
   
  //     const data = {
  //       'video_url': video_url
  //         }; // données pour télécharger le une video

  //       this.apiService.postData(data).subscribe({
  //       next: (response) => {
  //         const url = window.URL.createObjectURL(response);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = 'video.mp4'; // Nom du fichier téléchargé
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //       },
  //       error: (error) => console.error('Erreur:', error)
  //   });
  //  }

  // Mise a jour du fonction pour voire la progressiton du telechargement

  envoyerData() {
    const video_url = this.formulaire.get('video_url')?.value;

    const data = {'video_url': video_url};

    this.apiService.postDataWithProgress(data).subscribe({
      next: (progressData) => {
        if (progressData.response) {
          // Téléchager la vidéo une fois le téléchargemment terminé
          const url = window.URL.createObjectURL(progressData.response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'video.mp4';
          a.click();
          window.URL.revokeObjectURL(url);


        }else {
          // Mettre à jour la progression du téléchargemment 
          this.progression = progressData.progress;
        }
      },
      error: (error) => console.error('Erreur:', error)
    });
  }
}
