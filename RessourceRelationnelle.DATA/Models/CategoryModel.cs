using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Models
{
    public class CategoryModel
    {
        public string Id { get; set; }
        public string CategoryNale { get; set; } = string.Empty;  
        public List<ResourceModel> Resources { get; set; } = new List<ResourceModel>();
    }
}
