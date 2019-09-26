import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { SignalRService } from './services/signal-r.service';
import { userInfo } from 'os';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   private hubConnection: signalR.HubConnection
   constructor(public signalRService: SignalRService, private http: HttpClient) { }
   public data: string;

   user = 'TestUser';
   message = '';
   userMessage='';
   messages: string[] = [];
   userMessages: string[] = [];
    
   userId = Math.floor((Math.random() * 10) + 1);
   ngOnInit()
    {  
      const isIE = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);      
     
      this.startSingleConnection();
      this.addSingleListener(); 
      //this.startBroadcastConnection();
      this.addBroadcastChatListener();   
      //this.addGrpListener();        
   }


   ////Single user connection
   public startSingleConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('http://localhost:5010/chat', {skipNegotiation:true, transport: signalR.HttpTransportType.WebSockets})
                              .build();
      this.hubConnection
        .start()
        .then(() => console.log('Connection started. Current user is : ' + this.userId)
        )
        .catch(err => console.log('Error while starting connection: ' + err))
   }
   public addSingleListener = () => {
         this.hubConnection.on('sendToUser', (userId: string, userMessage: string) => {
         console.log('sendToUser:',userId + ' : ' + userMessage);
         const text =` Private Message : ${userMessage}`;
         this.userMessages.push(text);
      });
   }
   public sendUserMsg(): void {  
        this.hubConnection.invoke('sendToUser', this.userId, this.userMessage)
        .then(() => this.userMessage = '')
        .catch(err => console.error(err));
   }

   ////Broadcast message
   public startBroadcastConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('http://localhost:5010/chat', {skipNegotiation:true, transport: signalR.HttpTransportType.WebSockets})
                              .build();

      this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
   }
   public addBroadcastChatListener = () => {
      this.hubConnection.on('sendToAll', (user: string, receivedMessage: string) => {
      const text = `${user}: ${receivedMessage}`;
      this.messages.push(text);
      });
   }
   public sendMessage(): void {
      this.hubConnection
      .invoke('sendToAll', this.user, this.message)
      .then(() => this.message = '')
      .catch(err => console.error(err));
   }

   ////Group Message
   public addgroup() : void {
      this.hubConnection.invoke("AddToGroup", "GrpNewGroup")
      .then()
      .catch(err => console.error(err));
   }      
   public addGrpListener = () => {
      //debugger;
      this.hubConnection.on('AddToGroup', (groupName: string) => {
         console.log('====sendToUser:',groupName);
         const text =`${groupName}`;
         this.messages.push(text);
      });
   }
}


