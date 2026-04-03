using System.Text.Json.Serialization;

namespace RessourceRelationnelle.DATA.Models
{
    public class TypeResourceModel
    {
        public string Id { get; set; } = string.Empty;
        public string TypeRessource { get; set; } = string.Empty;
        [JsonIgnore]
        public virtual List<ResourceModel> Ressources { get; set; } = new List<ResourceModel>();
    }
}
