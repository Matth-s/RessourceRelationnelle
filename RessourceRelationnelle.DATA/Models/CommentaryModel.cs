namespace RessourceRelationnelle.DATA.Models
{
    public  class CommentaryModel
    {
        public string Id { get; set; }
        public string ModerationStatus { get; set; } = "Pending"; // "PENDING", "APPROVED", "REJECTED"
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // Foreign key to UserModel
        public string UserId { get; set; } = string.Empty;
        public UserModel User { get; set; } = null!;
        // Foreign key to Resource
        public int ResourceId { get; set; }
        public ResourceModel Resource { get; set; } = null!;
    }
}
