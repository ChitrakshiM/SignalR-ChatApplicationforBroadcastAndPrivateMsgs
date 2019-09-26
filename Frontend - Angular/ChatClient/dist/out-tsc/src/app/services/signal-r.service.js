import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
/*import {ChartModel} from '../interfaces/ChartModel';*/
let SignalRService = class SignalRService {
    /*import {ChartModel} from '../interfaces/ChartModel';*/
    constructor() {
        this.startConnection = () => {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5010/chat', { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
                .build();
            this.hubConnection
                .start()
                .then(() => console.log('Connection started'))
                .catch(err => console.log('Error while starting connection: ' + err));
        };
        this.addChatListener = () => {
            debugger;
            this.hubConnection.on('broadcastMessage', (data) => {
                this.data = data;
                console.log(data);
            });
        };
    }
};
SignalRService = tslib_1.__decorate([
    Injectable({
        providedIn: 'root'
    })
], SignalRService);
export { SignalRService };
//# sourceMappingURL=signal-r.service.js.map