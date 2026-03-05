using Microsoft.AspNetCore.Identity;

namespace RessourceRelationnelle.DATA.Models
{
    public class UserModel : IdentityUser
    {
        public bool IsActive { get; set; } = true;
        public string? SocialStatus { get; set; }

        public DateTime CreatedAt = DateTime.UtcNow;
        public DateTime? LastLogin = null;

        public string DemographicZoneId { get; set; } = string.Empty;
        public DemographicZoneModel DemographicZone { get; set; } = null!;
    }
}
