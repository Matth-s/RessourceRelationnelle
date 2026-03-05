
namespace RessourceRelationnelle.DATA.Models
{
    public class EventModel
    {
        public string Id { get; set; } = string.Empty;
        public DateTime StartAt { get; set; }

        // clés étrangeres
        public string UserId { get; set; } = string.Empty;
        public UserModel User { get; set; } = null!;
        public int ResourceId { get; set; }
        public ResourceModel Resource { get; set; } = null!;
        public string DemographicZoneId { get; set; } = string.Empty;
        public DemographicZoneModel DemographicZone { get; set; } = null!;
    }
}
