namespace RessourceRelationnelle.DATA.Models
{
    public class CategoryModel
    { 
        public string Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;  
        public List<ResourceModel> Resources { get; set; } = new List<ResourceModel>();
    }
}
