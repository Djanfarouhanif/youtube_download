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
      success = false;
      searchControl: FormControl;
      load:boolean = false;
      thumbnailUrl: string = '';


      constructor( private apiService:ApiService){
        this.searchControl = new FormControl('');
        this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
          
              this.load = !this.load // Activer la bar de téléchagement 
              const data = {"video_url": value}
              this.apiService.getData(data).subscribe({
                next: response => {
                  this.load = false;
                  console.log(`title: ${response.success.title}`);
                  this.thumbnailUrl = response.success.Thumbnail
                },
                error: err => {
                  this.load = false;
                  console.log(`error: ${err}`);
                }
              });
          
        });
      };

      download(){
        const data = {"video_url": this.searchControl.value};
        console.log(this.searchControl.value);

        this.apiService.downloadVideo(data).subscribe({
          next: response => { 
            console.log("success");
          },
          error: err => {
            console.log(`error ${err}`);
          }
        })
      }

}
