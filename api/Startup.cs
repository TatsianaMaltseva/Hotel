using AutoMapper;
using iTechArt.Hotels.Api.Models;
using iTechArt.Hotels.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Win32.TaskScheduler;
using System;

namespace iTechArt.Hotels.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddDbContext<HotelsDatabaseContext>(
                options => options.UseSqlServer(Configuration.GetConnectionString("HotelsDb"))
            );

            var authOptionsConfiguration = Configuration.GetSection("Auth");
            services.Configure<AuthOptions>(authOptionsConfiguration);
            AuthOptions authOptions = authOptionsConfiguration.Get<AuthOptions>();

            services.Configure<ResourcesOptions>(Configuration.GetSection("Resources"));

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(
                    options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidIssuer = authOptions.Issuer,

                            ValidateAudience = true,
                            ValidAudience = authOptions.Audience,

                            ValidateLifetime = true,

                            IssuerSigningKey = authOptions.GetSymmetricSecurityKey(),
                            ValidateIssuerSigningKey = true
                        };
                    }
                );
            services.AddSingleton<HashPasswordsService>();
            services.AddSingleton<JwtService>();

            MapperConfiguration mapperConfig = new(mc =>
            {
                mc.AddProfile(new Services.Mapper());
            });

            IMapper mapper = mapperConfig.CreateMapper();
            services.AddSingleton(mapper);

            services.AddCors(options =>
            {
                options.AddDefaultPolicy( 
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            }); // about cors: should allow request just from my applications
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles(
                new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(Configuration["Resources:ImagesFolder"]),
                    RequestPath = "/api/hotels/{hotelId}/images"
                }
            );

            AddClearRoomViewsTask();

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void AddClearRoomViewsTask()
        {
            using (var ts = new TaskService())
            {
                TaskDefinition td = ts.NewTask();
                td.Settings.ExecutionTimeLimit = new TimeSpan(1, 0, 0);
                td.Settings.MultipleInstances = TaskInstancesPolicy.Parallel;

                var trigger = new TimeTrigger();
                trigger.Repetition.Interval = TimeSpan.FromMinutes(5);
                td.Triggers.Add(trigger);

                td.Actions.Add(new ExecAction(System.IO.Path.Combine(Configuration["Resources:ScriptsFolder"], "delete_views.bat")));

                ts.RootFolder.RegisterTaskDefinition("Clear room viewes table", td);
            }
        }
    }
}