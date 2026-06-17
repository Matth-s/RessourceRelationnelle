using System.Text.Json.Serialization;

namespace RessourceRelationnelle.DATA.Models
{
    public class TypeRelationModel
    {
        public string Id { get; set; } = string.Empty;
        public string TypeRelation { get; set; } = string.Empty;
        [JsonIgnore]
        public List<ResourceModel> Ressources { get; set; } = new List<ResourceModel>();
    }
}
