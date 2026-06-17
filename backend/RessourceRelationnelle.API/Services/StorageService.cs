using Supabase;

namespace RessourceRelationnelle.API.Services
{
    public interface IStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task DeleteFileAsync(string fileUrl);
    }

    public class StorageService : IStorageService
    {
        private readonly Client supabaseClient;
        private readonly string bucketName;

        public StorageService(IConfiguration configuration)
        {
            var url = configuration["Supabase:Url"]
                ?? throw new InvalidOperationException("Supabase:Url manquant");
            var key = configuration["Supabase:Key"]
                ?? throw new InvalidOperationException("Supabase:Key manquant");
            bucketName = configuration["Supabase:BucketName"] ?? "ressources";

            var options = new SupabaseOptions { AutoConnectRealtime = false };
            supabaseClient = new Client(url, key, options);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Fichier vide ou invalide");

            // Nom unique pour éviter les collisions
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = $"{folder}/{fileName}";

            // Conversion IFormFile → byte[]
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();

            // Initialisation du client Supabase (nécessaire avant la 1ère requête)
            await supabaseClient.InitializeAsync();

            // Upload dans le bucket
            await supabaseClient.Storage
                .From(bucketName)
                .Upload(fileBytes, filePath, new Supabase.Storage.FileOptions
                {
                    ContentType = file.ContentType,
                    Upsert = false
                });

            // Récupération de l'URL publique
            var publicUrl = supabaseClient.Storage
                .From(bucketName)
                .GetPublicUrl(filePath);

            return publicUrl;
        }

        public async Task DeleteFileAsync(string fileUrl)
        {
            // Extrait le chemin du fichier depuis l'URL publique
            var marker = $"/{bucketName}/";
            var index = fileUrl.IndexOf(marker);
            if (index == -1) return;

            var filePath = fileUrl.Substring(index + marker.Length);

            await supabaseClient.InitializeAsync();
            await supabaseClient.Storage
                .From(bucketName)
                .Remove(new List<string> { filePath });
        }
    }
}