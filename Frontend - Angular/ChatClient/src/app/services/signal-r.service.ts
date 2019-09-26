import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
/*import {ChartModel} from '../interfaces/ChartModel';*/


@Injectable({
  providedIn: 'root'
})


export class SignalRService {
  public data: string[];
 
    private hubConnection: signalR.HubConnection
    
      public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
                                .withUrl('http://localhost:5010/chat', {skipNegotiation:true, transport: signalR.HttpTransportType.WebSockets})
                                .build();
    
        this.hubConnection
          .start()
          .then(() => console.log('Connection started'))
          .catch(err => console.log('Error while starting connection: ' + err))
      }
    
      
      public addChatListener = () => {
        debugger;
        this.hubConnection.on('broadcastMessage', (data) => {
          this.data = data;
          console.log(data);
        });
  
    }
 }