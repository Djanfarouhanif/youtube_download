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


      constructor(){
        this.searchControl = new FormControl('');
        this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
              this.load = !this.load
          
        })
      }

}
