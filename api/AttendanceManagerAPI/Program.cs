using System.Text;
using AttendanceManagerAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Newtonsoft.Json;
using AttendanceManagerAPI.Models.Token;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

// Registering custom services
builder.Services.AddScoped<TokenGenerator>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();

// Registering Authorization Handlers for policies
builder.Services.AddScoped<IAuthorizationHandler, StudentEnrolledHandler>();
builder.Services.AddScoped<IAuthorizationHandler, TeacherOrStudentHandler>();
builder.Services.AddScoped<IAuthorizationHandler, IsCourseTeacherHandler>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors();

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
    })
    .AddXmlSerializerFormatters();

builder.Services.Configure<MvcOptions>(opts =>
{
    opts.RespectBrowserAcceptHeader = true;
    opts.ReturnHttpNotAcceptable = true;
});

builder.Services.Configure<MvcNewtonsoftJsonOptions>(options =>
    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore);

// Configure authentication & JWT
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8
                    .GetBytes(builder.Configuration["JWT:Secret"]!)
                    ),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddDbContext<AttendanceManagerContext>(options =>
{
    options.UseNpgsql(builder.Configuration["ConnectionStrings:AttendanceManagerDB"]);
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("StudentEnrolled", policy =>
    {
        policy.AddRequirements(new StudentEnrolled());
    });

    options.AddPolicy("IsCourseTeacher", policy =>
    {
        policy.AddRequirements(new IsCourseTeacher());
    });

    options.AddPolicy("TeacherOrStudent", policy =>
    {
        policy.AddRequirements(new TeacherOrStudent());
    });
});

var app = builder.Build();

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();