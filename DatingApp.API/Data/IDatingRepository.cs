using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
          void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int Id);
         Task<Photo> GetPhoto(int Id);
         Task<Photo> GetMainPhotoForUser(int userId);
        //  Task<Like> GetLike(int userId, int recipientId);
        //  Task<Message> GetMessage(int Id);
        //  Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        //  Task<IEnumerable<Message>> GetMessagesThread(int userId, int recipientId);
    }
}