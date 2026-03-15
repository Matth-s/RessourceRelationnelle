namespace RessourceRelationnelle.DATA.Models
{
    public class ProgressionModel
    {     
        public bool IsFavorite { get; set; } = false;
        public bool BookMarked { get; set; } = false;
        public DateTime updatedAt { get; set; } = DateTime.UtcNow;

        // STATUS EXPLOTATION ????????

        // clés étrangeres
        public string UserId { get; set; } = string.Empty;
        public string ResourceId { get; set; } = string.Empty;
        public UserModel User { get; set; } = null!;
        public ResourceModel Resource { get; set; } = null!;
    }
}
