using RessourceRelationnelle.DATA.Models;

namespace RessourceRelationnelle.DATA.Repositories
{
    public interface IEventRepository
    {
        Task<EventModel> Create(EventModel eventModel);
        Task<EventModel> GetEvent(string id);
        Task<List<EventModel>> GetAll();
        Task<IEnumerable<EventModel>> GetForResource(string id);
        Task<EventModel> Update(string id, EventModel eventModel);
        Task<bool> Delete(string id);
    }
}
