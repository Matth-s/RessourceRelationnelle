using System.Text.Json.Serialization;

namespace RessourceRelationnelle.DATA.Models
{
    public class CategoryModel
    { 
        public string Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        [JsonIgnore]
        public virtual List<ResourceModel> Resources { get; set; } = new List<ResourceModel>();
    }
}
