namespace RessourceRelationnelle.DATA.Models
{
    public class SharedModel
    {
        public DateTime SharedAt { get; set; } = DateTime.UtcNow;

        // clés étrangeres
        public string UserId { get; set; } = string.Empty;
        public UserModel User { get; set; } = null!;
        public int ResourceId { get; set; }
        public ResourceModel Resource { get; set; } = null!;
    }
}
