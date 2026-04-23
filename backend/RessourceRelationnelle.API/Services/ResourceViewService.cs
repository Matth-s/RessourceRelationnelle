using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using RessourceRelationnelle.DATA;
using Microsoft.EntityFrameworkCore; // <-- Ajout obligatoire pour Entity Framework

public class ResourceViewService
{
    private readonly DataContext context;
    private readonly IMemoryCache cache;
    private readonly IHttpContextAccessor httpContextAccessor;

    public ResourceViewService(DataContext pContext, IMemoryCache pCache, IHttpContextAccessor pHttpContextAccessor)
    {
        context = pContext;
        cache = pCache;
        httpContextAccessor = pHttpContextAccessor;
    }

    public async Task RecordViewAsync(string resourceId)
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext == null) return;

        string viewerId = GetViewerIdentifier(httpContext);

        string cacheKey = $"view_cooldown_{resourceId}_{viewerId}";

        if (!cache.TryGetValue(cacheKey, out _))
        {
            cache.Set(cacheKey, true, TimeSpan.FromHours(12));

            await context.Resources
                .Where(r => r.Id == resourceId)
                .ExecuteUpdateAsync(s => s.SetProperty(r => r.ViewCount, r => r.ViewCount + 1));
        }
    }

    private string GetViewerIdentifier(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return $"USER_{userId}";
        }

        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown_ip";
        var userAgent = context.Request.Headers["User-Agent"].ToString();

        var inputBytes = Encoding.UTF8.GetBytes(ip + userAgent);
        var hashBytes = SHA256.HashData(inputBytes);

        return $"ANON_{Convert.ToHexString(hashBytes)}";
    }
}