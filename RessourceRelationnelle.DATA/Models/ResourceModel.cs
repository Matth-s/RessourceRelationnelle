 
namespace RessourceRelationnelle.DATA.Models
{
    public class ResourceModel
    {
        public string Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Resume { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public bool IsVisible { get; set; } = true;
        public string PublicationStatus { get; set; } = "Pending"; // "PENDING", "APPROVED", "REJECTED"
        public DateTime? UpdatedAt { get; set; } = null;
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        // cle etrangeres
        public string UserId { get; set; } = string.Empty;
        public UserModel User { get; set; } = null!;
        public string CategoryId { get; set; } = string.Empty;
        public CategoryModel Category { get; set; } = null!;
        public string RessourceTypeId { get; set; } = string.Empty;
        public TypeResourceModel TypeRessource { get; set; } = null!;
        public string RelationTypeId { get; set; } = string.Empty;
        public TypeRelationModel TypeRelation { get; set; } = null!;         
    }
}
