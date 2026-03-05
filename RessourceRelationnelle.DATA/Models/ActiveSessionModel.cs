namespace RessourceRelationnelle.DATA.Models
{
    public class ActiveSessionModel
    {
        public string Id { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool Status { get; set; } = true; 

        // Navigation property 
        public string RessourceId { get; set; } = string.Empty;

        public ResourceModel Resource { get; set; } = null!;

    }
}
