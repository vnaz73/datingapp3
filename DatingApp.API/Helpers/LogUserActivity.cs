using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task  OnActionExecutionAsync(ActionExecutingContext context,
         ActionExecutionDelegate next)
        {
           var actionResult = await next();

            var userId = int.Parse(actionResult.HttpContext.User
            .FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = actionResult.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await repo.GetUser(userId);
            user.LastActive = DateTime.Now;
            await repo.SaveAll();
        }
    }
}