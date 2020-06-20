using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using datingapp.api.Data;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using datingapp.api.Helpers;
using System;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where( u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int Id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == Id);
            return  user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
             var users =  _context.Users.Include(p => p.Photos).OrderBy(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);

            // if (userParams.Likees)
            // {
            //     var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
            //     users = users.Where(u => userLikers.Contains(u.Id));
            // }

            // if (userParams.Likers)
            // {
            //     var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
            //     users = users.Where(u => userLikees.Contains(u.Id));
            // }
            
            if (userParams.MinAge != 18 || userParams.MaxAge !=99)
            {
                var minDob = DateTime.Now.AddYears(-userParams.MaxAge);
                var maxDob = DateTime.Now.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth>= minDob && u.DateOfBirth <=maxDob);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch(userParams.OrderBy)
                {
                    case "created":
                    users = users.OrderBy(u => u.Created);
                    break;
                    default:
                    users = users.OrderBy(u => u.LastActive);
                    break;
                }
                   
            }

            return await PagedList<User>.CreateAsync( users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}