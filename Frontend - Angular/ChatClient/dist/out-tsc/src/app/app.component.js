import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import * as signalR from "@aspnet/signalr";
let AppComponent = class AppComponent {
    constructor(signalRService, http) {
        this.signalRService = signalRService;
        this.http = http;
        this.nick = 'mnjkb';
        this.message = '';
        this.userMessage = '';
        this.messages = [];
        //userId = Math.floor((Math.random() * 10) + 1);
        this.id = "3";
        ////Single user connection
        this.startSingleConnection = () => {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5010/chat/' + this.id, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
                .build();
            this.hubConnection
                .start()
                .then(() => console.log('Connection started'))
                .catch(err => console.log('Error while starting connection: ' + err));
        };
        this.addSingleListener = () => {
            //debugger;
            this.hubConnection.on('sendToUser', (id, receivedMessage) => {
                console.log('====sendToUser:', id);
                const text = `${id}: ${receivedMessage}`;
                this.messages.push(text);
            });
        };
        ////Broadcast message
        this.startBroadcastConnection = () => {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5010/chat', { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
                .build();
            this.hubConnection
                .start()
                .then(() => console.log('Connection started'))
                .catch(err => console.log('Error while starting connection: ' + err));
        };
        this.addBroadcastChatListener = () => {
            //debugger;
            this.hubConnection.on('sendToAll', (nick, receivedMessage) => {
                console.log('====sendToAll:', nick);
                const text = `${nick}: ${receivedMessage}`;
                this.messages.push(text);
            });
        };
    }
    ngOnInit() {
        this.startSingleConnection();
        this.addSingleListener();
        //this.addSingleChatListener();
        // this.startBroadcastConnection();
        // this.addBroadcastChatListener();   
    }
    sendUserMsg() {
        this.hubConnection.invoke('sendToUser', this.id, this.userMessage)
            .then()
            .catch(err => console.error(err));
    } //() => this.userMessage = ''
    sendMessage() {
        this.hubConnection
            .invoke('sendToAll', this.nick, this.message)
            .then(() => this.message = '')
            .catch(err => console.error(err));
    }
};
AppComponent = tslib_1.__decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
// public addChatListener = () => {
//   this.hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
//     const text = `${nick}: ${receivedMessage}`;
//     this.messages.push(text);
//   });
// }
//  private startHttpRequest = () => {
//   this.http.get('http://localhost:5010/api/chat', { withCredentials: true })
//     .subscribe(res => {
//       console.log(res);
//     })
// } 
// => {
//   const text =`${message}`;
//   this.messages.push(text);
// }
// public startConnection = () => {
//   this.hubConnection = new signalR.HubConnectionBuilder()
//               .withUrl('http://localhost:5010/chat', {skipNegotiation:true, transport: signalR.HttpTransportType.WebSockets})
//              .build();
//   this.hubConnection
//      .start()  
//      .then(() => this.hubConnection
//      .invoke('sendToAll', this.nick, this.message))
//      .catch(err=> console.log('Error while starting connection: ' + err))    
//  }              
//  public sendMessage(): void {
//    this.hubConnection
//      .invoke('sendToAll', this.nick, this.message)
//      .then(() => this.message = '')
//      .catch(err => console.error(err));
//  }
// public startBroadcastConnection = () => {
//  this.hubConnection = new signalR.HubConnectionBuilder()
//  .withUrl("http://localhost:5010/chat?userId=" + this.userId, {skipNegotiation:true, transport: signalR.HttpTransportType.WebSockets})
//                          .build();
//  this.hubConnection
//    .start()
//    .then(() => console.log('Connection started'))
//    .catch(err => console.log('Error while starting connection: ' + err))
// }
// public SendUserMsg =() => {
//  this.hubConnection.invoke('sendToUser', (this.userId, this.message)) 
//  .then(() => this.message = '')
//  .catch(err=> console.error(err));
// }
//# sourceMappingURL=app.component.js.map