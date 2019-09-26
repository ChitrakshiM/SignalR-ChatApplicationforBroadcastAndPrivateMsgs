using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatAPI
{
    public class ChatHub : Hub
    {
        public readonly IUserConnectionManager _userConnectionManager;
        string userConnectionMapLocker = string.Empty;
        public static Dictionary<string, List<string>> userConnectionMap = new Dictionary<string, List<string>>();
        public ChatHub(IUserConnectionManager userConnectionManager)
        {
            _userConnectionManager = userConnectionManager;
        }

        public string GetConnectionId()
        {
            var httpContext = this.Context.GetHttpContext();
            var userId = httpContext.Request.Query["userId"];
            lock (userConnectionMapLocker)
            {
                if (!userConnectionMap.ContainsKey(userId))
                {
                    userConnectionMap[userId] = new List<string>();
                }
                userConnectionMap.Add(userId, userConnectionMap[userId]);
                userConnectionMap[userId].Add(Context.ConnectionId);
            }
            _userConnectionManager.KeepUserConnection(userId, Context.ConnectionId);
            return Context.ConnectionId;
        }


        public async override Task OnDisconnectedAsync(Exception ex)
        {
            var connectionId = Context.ConnectionId;
            _userConnectionManager.RemoveUserConnection(connectionId);
            var value = await Task.FromResult(0); //adding dump code to follow the template of Hub > OnDisconnectedAsync
        }

        public void sendToAll(string name, string message)
        {
            Clients.All.SendAsync("sendToAll", name, message);
        }

        public Task sendToUser(string userId, string userMessage)
        {
            userId = Context.ConnectionId;
            return Clients.Client(userId).SendAsync("sendToUser", userId, userMessage);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("AddToGroup", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public Task SendPrivateMessage(string user, string message)
        {
            return Clients.User(Context.UserIdentifier).SendAsync("Send", $"{Context.ConnectionId}: message {message}.");
        }
    }

}

