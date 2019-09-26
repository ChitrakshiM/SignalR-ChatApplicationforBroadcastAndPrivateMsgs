using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ChatAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                                 builder => builder.WithOrigins("http://localhost:4500")
                                                     .AllowAnyHeader()
                                                     .AllowAnyMethod()
                                                     .AllowCredentials()
                                                     .SetPreflightMaxAge(TimeSpan.FromMinutes(10)));

            });
            services.AddSignalR(er => { er.EnableDetailedErrors = true; });
            services.AddSingleton<IUserConnectionManager, UserConnectionManager>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
          
            app.UseAuthentication();

            app.UseCors("CorsPolicy");
            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("/chat");
            });

            app.UseMvcWithDefaultRoute();
        }
    }
}
