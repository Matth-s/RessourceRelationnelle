using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA.Models;
using System;

namespace RessourceRelationnelle.DATA.Repositories.Sql
{
    public class SQLEventRepository : IEventRepository
    {
        private readonly DataContext context;

        public SQLEventRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<EventModel> Create(EventModel model)
        {
            model.Id = Guid.NewGuid().ToString();
            context.Add(model);
            await context.SaveChangesAsync();
            return model;
        }

        public async Task<bool> Delete(string id)
        {
            EventModel? eventModel = await context.Event.AsNoTracking().FirstOrDefaultAsync(x =>  x.Id == id);

            if(eventModel == null)
            {
                return false;
            }
            context.Remove(eventModel);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<List<EventModel>> GetAll()
        {
            return await context.Event.AsNoTracking().ToListAsync();
        }

        public async Task<EventModel?> GetEvent(string id)
        {
            return await context.Event.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<EventModel>> GetForResource(string? idResource)
        {
            return await context.Event.Where(x => x.ResourceId == idResource).ToListAsync();
        }

        public async Task<EventModel> Update(string id, EventModel eventModel)
        {
            var entity = await context.Event.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null)
                return null;

            context.Entry(entity).CurrentValues.SetValues(eventModel);
            await context.SaveChangesAsync();
            return eventModel;
        }
    }
}
