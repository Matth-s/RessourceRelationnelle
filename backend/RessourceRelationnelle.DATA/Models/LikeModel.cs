using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Models
{
    [PrimaryKey(nameof(UserId), nameof(ResourceId))]
    public class LikeModel
    {
        public string UserId { get; set; } = string.Empty;
        public string ResourceId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public UserModel User { get; set; } = null!;

        [ForeignKey(nameof(ResourceId))]
        public ResourceModel Resource { get; set; } = null!;
    }
}
