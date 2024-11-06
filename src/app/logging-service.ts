import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingSerive {
  lastLog: string;

  printLog(message: string) {
    console.log(message);
    console.log(this.lastLog);
    this.lastLog = message;
  }
}
