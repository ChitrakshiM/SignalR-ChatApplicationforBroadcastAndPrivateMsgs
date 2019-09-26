using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        public IHubContext<ChatHub> _chatHub;
        public readonly IUserConnectionManager _userConnectionManager;

        public ChatController(IHubContext<ChatHub> hub, IUserConnectionManager userConnectionMgr)
        {
            _chatHub = hub;
            _userConnectionManager = userConnectionMgr;
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {                       
            _chatHub.Clients.All.SendAsync("broadcastMessage", "Server Message");
            return new string[] { "value1", "value2" };
        }

        //// GET api/values/5
        [HttpGet("{id}")]
        public string SendToUser(string id, string userMessage)
        {
            _chatHub.Clients.User(id).SendAsync("sendToUser", id, userMessage);
            return "Get value";
        }

        ////// Post
        //[HttpPost("UserPost/{userId}")]
        //public string PostUser(string userId, [FromForm] string userMessage)
        //{
        //    List<string> connections = _userConnectionManager.GetUserConnections(userId);
        //    if (connections != null & connections.Count > 0)
        //    {
        //        foreach (var connectionId in connections)
        //        {
        //            _chatHub.Clients.Client(connectionId).SendAsync("sendToUser", userMessage);
        //        }
        //    }
        //    return "Post value";
        //}


        //[HttpPost]
        //public string Post([FromBody] string message)
        //{
        //    string status = string.Empty;
        //    try
        //    {
        //        _chatHub.Clients.All.SendAsync("SendMessage", message);
        //        status = "Success";
        //    }
        //    catch(Exception ex)
        //    {
        //        status = ex.Message;
        //    }
        //    return status;
        //    //return View();
        //}


    }
}
