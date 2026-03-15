using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLTypeResourceRepository : ITypeResourceRepository
    {
        private readonly DataContext context;

        public SQLTypeResourceRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<TypeResourceModel> Create(TypeResourceModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.TypeResources.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task Delete(string id)
        {
            TypeResourceModel? existingTypeResource = await context.TypeResources.FirstOrDefaultAsync(x => x.Id == id);
            if (existingTypeResource != null)
            {
                context.TypeResources.Remove(existingTypeResource);
                await context.SaveChangesAsync();
            }
        }
        public Task<IEnumerable<TypeResourceModel>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<TypeResourceModel?> GetOne(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<TypeResourceModel?> GetOneByName(string name)
        {
            return await context.TypeResources
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.TypeRessource == name);
        }

        public Task<TypeResourceModel> Update(TypeResourceModel model)
        {
            throw new NotImplementedException();
        }
    }
}
