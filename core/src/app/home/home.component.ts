import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  
})
export class HomeComponent {
    
  formulaire:FormGroup

  constructor(private apiService:ApiService, private formBuilder: FormBuilder){
    this.formulaire = this.formBuilder.group({
      video_url: ['', Validators.required] // Champ "video_url" avec validation requise
    });
  }

  enyoyerData(){
    const data = {
      'video_url': this.formulaire?.valid
    }; // données pour télécharger le une video

    this.apiService.postData(data).subscribe({
      next: (response) => console.log("Réponse du serveur:", response),
      error: (error) => console.error('Erreur:', error)
    });
  }
}
