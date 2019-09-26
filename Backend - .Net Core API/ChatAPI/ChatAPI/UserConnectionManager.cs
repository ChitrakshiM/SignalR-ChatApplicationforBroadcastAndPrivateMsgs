using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI
{
    public class UserConnectionManager : IUserConnectionManager
    {
        public static Dictionary<string, List<string>> userConnectionMap = new Dictionary<string, List<string>>();
        private static string userConnectionMapLocker = string.Empty;

        /// <summary>
        /// Connects user id with connection id
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="connectionId"></param>
        public void KeepUserConnection(string userId, string connectionId)
        {
            lock(userConnectionMapLocker)
            {
                if(!userConnectionMap.ContainsKey(userId))
                {
                    userConnectionMap[userId] = new List<string>();
                }
                userConnectionMap[userId].Add(connectionId);
            }
        }
        
        /// <summary>
        /// Removes connection id of user
        /// </summary>
        /// <param name="connectionId"></param>
        public void RemoveUserConnection(string connectionId)
        {
            lock(userConnectionMapLocker)
            {
                foreach(var userId in userConnectionMap.Keys)
                {
                    if(userConnectionMap.ContainsKey(userId))
                    {
                        if(userConnectionMap[userId].Contains(connectionId))
                        {
                            userConnectionMap[userId].Remove(connectionId);
                            break;
                        }
                    }
                }
            }
        }


        public List<string> GetUserConnections(string userId)
        {
            var conn = new List<string>();
            lock(userConnectionMapLocker)
            {
                conn = userConnectionMap[userId];
            }
            return conn;
        }

    }
}
