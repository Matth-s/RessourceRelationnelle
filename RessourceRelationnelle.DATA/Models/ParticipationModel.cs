namespace RessourceRelationnelle.DATA.Models
{
    public class ParticipationModel
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime AcceptedAt { get; set; }
        public string UserId { get; set; } = string.Empty;
        public UserModel User { get; set; } = null!;
        public string SessionId { get; set; } = string.Empty;
        public ActiveSessionModel Session { get; set; } = null!;
        public string InvitationStatus { get; set; } = "Pending"; // "PENDING", "ACCEPTED", "REJECTED"
    }
}
