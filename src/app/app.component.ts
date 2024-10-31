import { Component, OnInit } from '@angular/core';
import { AuthResponseData } from './auth/back4-app.service';
// import { Back4AppService } from './back4-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})

export class AppComponent implements OnInit {
  // loadedfeature = 'recepie1';
  // onNavigate(feature: string) {
  //   this.loadedfeature = feature;
  // }

  // constructor(private back4AppService: Back4AppService) {}
  constructor() {}

  ngOnInit() {
    
    };

    // Call the postData method and log the response
    // this.back4AppService.postData(sampleData).subscribe({
    //   next: (response) => console.log('Data posted successfully:', response),
    //   error: (error) => console.error('Error posting data:', error),
    // });
  }



