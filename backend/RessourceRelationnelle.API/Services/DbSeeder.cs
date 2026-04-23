using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RessourceRelationnelle.DATA;
using RessourceRelationnelle.DATA.Models;
using System.Globalization;
using System.Text;

namespace RessourceRelationnelle.API.Services
{
    public static class DbSeeder
    {
        private const string RoleUser = "User";
        private const string RoleAdmin = "Admin";
        private const string RoleModerator = "Moderator";
        private const string RoleSuperAdmin = "SuperAdmin";

        private const string DemoPassword = "Demo123!";
        private const string DemoUrlBase = "https://demo.ressourcesrelationnelles.local";

        private static readonly CategorySeed[] CategorySeeds =
        {
            new("COMMUNICATION", "Communication", "INCONNUS"),
            new("CULTURES", "Cultures", "AMIS ET COMMUNAUTÉS"),
            new("DÉVELOPPEMENT PERSONNEL", "Développement personnel", "SOI"),
            new("INTELLIGENCE ÉMOTIONNELLE", "Intelligence émotionnelle", "SOI"),
            new("LOISIRS", "Loisirs", "AMIS ET COMMUNAUTÉS"),
            new("MONDE PROFESSIONNEL", "Monde professionnel", "PROFESSIONNELLE : COLLÈGUES, COLLABORATEURS ET MANAGERS"),
            new("PARENTALITÉ", "Parentalité", "FAMILLE : ENFANTS / PARENTS / FRATRIE"),
            new("QUALITÉ DE VIE", "Qualité de vie", "SOI"),
            new("RECHERCHE DE SENS", "Recherche de sens", "SOI"),
            new("SANTÉ PHYSIQUE", "Santé physique", "SOI"),
            new("SANTÉ PSYCHIQUE", "Santé psychique", "SOI"),
            new("SPIRITUALITÉ", "Spiritualité", "SOI"),
            new("VIE AFFECTIVE", "Vie affective", "CONJOINTS"),
        };

        private static readonly string[] RelationNames =
        {
            "SOI",
            "CONJOINTS",
            "FAMILLE : ENFANTS / PARENTS / FRATRIE",
            "PROFESSIONNELLE : COLLÈGUES, COLLABORATEURS ET MANAGERS",
            "AMIS ET COMMUNAUTÉS",
            "INCONNUS"
        };

        private static readonly string[] ResourceTypeNames =
        {
            "ACTIVITÉ / JEU À RÉALISER",
            "ARTICLE",
            "CARTE DÉFI",
            "COURS AU FORMAT PDF",
            "EXERCICE / ATELIER",
            "FICHE DE LECTURE",
            "JEU EN LIGNE",
            "VIDÉO"
        };

        public static async Task SeedAsync(IServiceProvider services)
        {
            var context = services.GetRequiredService<DataContext>();
            var userManager = services.GetRequiredService<UserManager<UserModel>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            await SeedRolesAsync(roleManager);
            var zones = await SeedDemographicZonesAsync(context);
            var categories = await SeedCategoriesAsync(context);
            var relationTypes = await SeedTypeRelationsAsync(context);
            var resourceTypes = await SeedTypeResourcesAsync(context);
            var demoUsers = await SeedUsersAsync(userManager, zones);

            await SeedDemoBusinessDataAsync(
                context,
                demoUsers,
                zones,
                categories,
                relationTypes,
                resourceTypes);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            var roles = new[] { RoleUser, RoleAdmin, RoleModerator, RoleSuperAdmin };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var result = await roleManager.CreateAsync(new IdentityRole(role));
                    if (!result.Succeeded)
                    {
                        throw new Exception(
                            $"Impossible de créer le rôle '{role}' : {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
        }

        private static async Task<List<DemographicZoneModel>> SeedDemographicZonesAsync(DataContext context)
        {
            var zoneNames = new[]
            {
                "CENTRE-VILLE",
                "QUARTIER NORD",
                "QUARTIER SUD",
                "ZONE PÉRIURBAINE",
                "ZONE RURALE"
            };

            var existing = await context.DemographicsZone
                .Select(z => z.Zone)
                .ToListAsync();

            var existingSet = new HashSet<string>(existing, StringComparer.OrdinalIgnoreCase);

            foreach (var zoneName in zoneNames)
            {
                if (!existingSet.Contains(zoneName))
                {
                    context.DemographicsZone.Add(new DemographicZoneModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        Zone = zoneName
                    });
                }
            }

            await context.SaveChangesAsync();

            return await context.DemographicsZone
                .Where(z => zoneNames.Contains(z.Zone))
                .OrderBy(z => z.Zone)
                .ToListAsync();
        }

        private static async Task<List<CategoryModel>> SeedCategoriesAsync(DataContext context)
        {
            var names = CategorySeeds.Select(c => c.StoredName).ToArray();

            var existing = await context.Categories
                .Select(c => c.CategoryName)
                .ToListAsync();

            var existingSet = new HashSet<string>(existing, StringComparer.OrdinalIgnoreCase);

            foreach (var seed in CategorySeeds)
            {
                if (!existingSet.Contains(seed.StoredName))
                {
                    context.Categories.Add(new CategoryModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        CategoryName = seed.StoredName
                    });
                }
            }

            await context.SaveChangesAsync();

            return await context.Categories
                .Where(c => names.Contains(c.CategoryName))
                .ToListAsync();
        }

        private static async Task<List<TypeRelationModel>> SeedTypeRelationsAsync(DataContext context)
        {
            var existing = await context.TypeRelations
                .Select(t => t.TypeRelation)
                .ToListAsync();

            var existingSet = new HashSet<string>(existing, StringComparer.OrdinalIgnoreCase);

            foreach (var relationName in RelationNames)
            {
                if (!existingSet.Contains(relationName))
                {
                    context.TypeRelations.Add(new TypeRelationModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        TypeRelation = relationName
                    });
                }
            }

            await context.SaveChangesAsync();

            return await context.TypeRelations
                .Where(t => RelationNames.Contains(t.TypeRelation))
                .ToListAsync();
        }

        private static async Task<List<TypeResourceModel>> SeedTypeResourcesAsync(DataContext context)
        {
            var existing = await context.TypeResources
                .Select(t => t.TypeRessource)
                .ToListAsync();

            var existingSet = new HashSet<string>(existing, StringComparer.OrdinalIgnoreCase);

            foreach (var resourceTypeName in ResourceTypeNames)
            {
                if (!existingSet.Contains(resourceTypeName))
                {
                    context.TypeResources.Add(new TypeResourceModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        TypeRessource = resourceTypeName
                    });
                }
            }

            await context.SaveChangesAsync();

            return await context.TypeResources
                .Where(t => ResourceTypeNames.Contains(t.TypeRessource))
                .ToListAsync();
        }

        private static async Task<DemoUsers> SeedUsersAsync(
            UserManager<UserModel> userManager,
            List<DemographicZoneModel> zones)
        {
            var zone1 = zones.ElementAtOrDefault(0)?.Id;
            var zone2 = zones.ElementAtOrDefault(1)?.Id;
            var zone3 = zones.ElementAtOrDefault(2)?.Id;
            var zone4 = zones.ElementAtOrDefault(3)?.Id;

            var existingAdmin = (await userManager.GetUsersInRoleAsync(RoleAdmin)).FirstOrDefault();
            var existingModerator = (await userManager.GetUsersInRoleAsync(RoleModerator)).FirstOrDefault();
            var existingSuperAdmin = (await userManager.GetUsersInRoleAsync(RoleSuperAdmin)).FirstOrDefault();

            var admin = existingAdmin ?? await EnsureUserAsync(
                userManager,
                "admin.demo@rr.local",
                "admin-demo",
                "Administrateur du catalogue",
                zone1,
                RoleAdmin);

            var moderator = existingModerator ?? await EnsureUserAsync(
                userManager,
                "moderator.demo@rr.local",
                "moderator-demo",
                "Modérateur",
                zone2,
                RoleModerator);

            var superAdmin = existingSuperAdmin ?? await EnsureUserAsync(
                userManager,
                "superadmin.demo@rr.local",
                "superadmin-demo",
                "Super-administrateur",
                zone3,
                RoleSuperAdmin);

            var user1 = await EnsureUserAsync(
                userManager,
                "alice.demo@rr.local",
                "alice.demo",
                "Parent isolé",
                zone1,
                RoleUser);

            var user2 = await EnsureUserAsync(
                userManager,
                "bruno.demo@rr.local",
                "bruno.demo",
                "Salarié",
                zone2,
                RoleUser);

            var user3 = await EnsureUserAsync(
                userManager,
                "clara.demo@rr.local",
                "clara.demo",
                "Étudiante",
                zone4,
                RoleUser);

            return new DemoUsers
            {
                Admin = admin,
                Moderator = moderator,
                SuperAdmin = superAdmin,
                Users = new List<UserModel> { user1, user2, user3 }
            };
        }

        private static async Task<UserModel> EnsureUserAsync(
            UserManager<UserModel> userManager,
            string email,
            string userName,
            string socialStatus,
            string? demographicZoneId,
            params string[] roles)
        {
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                user = new UserModel
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = email,
                    UserName = userName,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    EmailConfirmed = true,
                    IsActive = true,
                    SocialStatus = socialStatus,
                    DemographicZoneId = demographicZoneId
                };

                user.CreatedAt = DateTime.UtcNow;
                user.LastLogin = DateTime.UtcNow;

                var createResult = await userManager.CreateAsync(user, DemoPassword);
                if (!createResult.Succeeded)
                {
                    throw new Exception(
                        $"Impossible de créer l'utilisateur '{email}' : {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                var needsUpdate = false;

                if (string.IsNullOrWhiteSpace(user.UserName))
                {
                    user.UserName = userName;
                    needsUpdate = true;
                }

                if (string.IsNullOrWhiteSpace(user.SocialStatus))
                {
                    user.SocialStatus = socialStatus;
                    needsUpdate = true;
                }

                if (string.IsNullOrWhiteSpace(user.DemographicZoneId) && !string.IsNullOrWhiteSpace(demographicZoneId))
                {
                    user.DemographicZoneId = demographicZoneId;
                    needsUpdate = true;
                }

                if (!user.EmailConfirmed)
                {
                    user.EmailConfirmed = true;
                    needsUpdate = true;
                }

                if (!user.IsActive)
                {
                    user.IsActive = true;
                    needsUpdate = true;
                }

                if (needsUpdate)
                {
                    var updateResult = await userManager.UpdateAsync(user);
                    if (!updateResult.Succeeded)
                    {
                        throw new Exception(
                            $"Impossible de mettre à jour l'utilisateur '{email}' : {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
                    }
                }
            }

            var currentRoles = await userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                if (!currentRoles.Contains(role))
                {
                    var roleResult = await userManager.AddToRoleAsync(user, role);
                    if (!roleResult.Succeeded)
                    {
                        throw new Exception(
                            $"Impossible d'ajouter le rôle '{role}' à '{email}' : {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
                    }
                }
            }

            return user;
        }

        private static async Task SeedDemoBusinessDataAsync(
            DataContext context,
            DemoUsers demoUsers,
            List<DemographicZoneModel> zones,
            List<CategoryModel> categories,
            List<TypeRelationModel> relationTypes,
            List<TypeResourceModel> resourceTypes)
        {

            var now = DateTime.UtcNow;

            var categoriesByName = categories.ToDictionary(c => c.CategoryName, StringComparer.OrdinalIgnoreCase);
            var relationTypesByName = relationTypes.ToDictionary(r => r.TypeRelation, StringComparer.OrdinalIgnoreCase);
            var resourceTypesByName = resourceTypes.ToDictionary(r => r.TypeRessource, StringComparer.OrdinalIgnoreCase);

            var resourceDefinitions = BuildResourceDefinitions();
            var authorPool = new List<UserModel> { demoUsers.Admin, demoUsers.Moderator };
            authorPool.AddRange(demoUsers.Users);

            var createdResources = new List<ResourceModel>();

            for (int i = 0; i < resourceDefinitions.Count; i++)
            {
                var definition = resourceDefinitions[i];
                var author = authorPool[i % authorPool.Count];
                var createdAt = now.AddDays(-(resourceDefinitions.Count - i + 5));

                var resource = new ResourceModel
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = definition.Title,
                    Resume = definition.Resume,
                    Content = definition.Content,
                    IsVisible = true,
                    PublicationStatus = "Approved",
                    CreatedAt = createdAt,
                    PublishedAt = createdAt.AddHours(2),
                    UpdatedAt = createdAt.AddDays(1),
                    UserId = author.Id,
                    CategoryId = categoriesByName[definition.CategoryName].Id,
                    TypeRelationId = relationTypesByName[definition.RelationName].Id,
                    TypeRessourceId = resourceTypesByName[definition.ResourceTypeName].Id
                };

                createdResources.Add(resource);
            }

            context.Resources.AddRange(createdResources);

            var comments = new List<CommentaryModel>();
            var progressions = new List<ProgressionModel>();
            var sharedItems = new List<SharedModel>();

            foreach (var categorySeed in CategorySeeds)
            {
                var categoryId = categoriesByName[categorySeed.StoredName].Id;
                var categoryResources = createdResources
                    .Where(r => r.CategoryId == categoryId)
                    .Take(3)
                    .ToList();

                for (int i = 0; i < categoryResources.Count; i++)
                {
                    var user = demoUsers.Users[i % demoUsers.Users.Count];
                    var resource = categoryResources[i];

                    comments.Add(new CommentaryModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        ResourceId = resource.Id,
                        UserId = user.Id,
                        ModerationStatus = i % 2 == 0 ? "Approved" : "Pending",
                        CreatedAt = now.AddDays(-(i + 1)),
                        Content = GetCommentText(categorySeed.DisplayName, i)
                    });

                    progressions.Add(new ProgressionModel
                    {
                        UserId = user.Id,
                        ResourceId = resource.Id,
                        IsFavorite = i == 0 || i == 2,
                        BookMarked = i == 1 || i == 2,
                        updatedAt = now.AddHours(-(i + 2))
                    });
                }

                var sharedResource = categoryResources.FirstOrDefault();
                if (sharedResource != null)
                {
                    sharedItems.Add(new SharedModel
                    {
                        UserId = demoUsers.Users[1].Id,
                        ResourceId = sharedResource.Id,
                        SharedAt = now.AddDays(-2)
                    });
                }
            }

            context.Comments.AddRange(comments);
            context.Progression.AddRange(progressions);
            context.Shared.AddRange(sharedItems);

            var activityTypeId = resourceTypesByName["ACTIVITÉ / JEU À RÉALISER"].Id;
            var activityResources = createdResources
                .Where(r => r.TypeRessourceId == activityTypeId)
                .ToList();

            var sessions = new List<ActiveSessionModel>();
            var events = new List<EventModel>();
            var participations = new List<ParticipationModel>();

            for (int i = 0; i < activityResources.Count; i++)
            {
                var resource = activityResources[i];
                var zone = zones[i % zones.Count];

                var session = new ActiveSessionModel
                {
                    Id = Guid.NewGuid().ToString(),
                    RessourceId = resource.Id,
                    CreatedAt = now.AddHours(-(i + 4)),
                    Status = true
                };

                sessions.Add(session);

                events.Add(new EventModel
                {
                    Id = Guid.NewGuid().ToString(),
                    Type = "ATELIER",
                    StartAt = now.Date.AddDays(i + 1).AddHours(18),
                    UserId = demoUsers.Moderator.Id,
                    ResourceId = resource.Id,
                    DemographicZoneId = zone.Id
                });

                participations.Add(new ParticipationModel
                {
                    UserId = demoUsers.Users[0].Id,
                    SessionId = session.Id,
                    CreatedAt = now.AddHours(-(i + 10)),
                    AcceptedAt = now.AddHours(-(i + 9)),
                    InvitationStatus = "Accepted"
                });

                participations.Add(new ParticipationModel
                {
                    UserId = demoUsers.Users[1].Id,
                    SessionId = session.Id,
                    CreatedAt = now.AddHours(-(i + 8)),
                    AcceptedAt = i % 2 == 0 ? now.AddHours(-(i + 7)) : default,
                    InvitationStatus = i % 2 == 0 ? "Accepted" : "Pending"
                });

                participations.Add(new ParticipationModel
                {
                    UserId = demoUsers.Users[2].Id,
                    SessionId = session.Id,
                    CreatedAt = now.AddHours(-(i + 6)),
                    AcceptedAt = default,
                    InvitationStatus = "Pending"
                });
            }

            context.ActiveSessions.AddRange(sessions);
            context.Event.AddRange(events);
            context.Participations.AddRange(participations);

            await context.SaveChangesAsync();
        }

        private static List<ResourceSeedDefinition> BuildResourceDefinitions()
        {
            var firstTypesByCategory = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                ["COMMUNICATION"] = "ARTICLE",
                ["CULTURES"] = "CARTE DÉFI",
                ["DÉVELOPPEMENT PERSONNEL"] = "COURS AU FORMAT PDF",
                ["INTELLIGENCE ÉMOTIONNELLE"] = "EXERCICE / ATELIER",
                ["LOISIRS"] = "ARTICLE",
                ["MONDE PROFESSIONNEL"] = "VIDÉO",
                ["PARENTALITÉ"] = "FICHE DE LECTURE",
                ["QUALITÉ DE VIE"] = "ARTICLE",
                ["RECHERCHE DE SENS"] = "COURS AU FORMAT PDF",
                ["SANTÉ PHYSIQUE"] = "ARTICLE",
                ["SANTÉ PSYCHIQUE"] = "ARTICLE",
                ["SPIRITUALITÉ"] = "FICHE DE LECTURE",
                ["VIE AFFECTIVE"] = "ARTICLE"
            };

            var secondTypesByCategory = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                ["COMMUNICATION"] = "VIDÉO",
                ["CULTURES"] = "ARTICLE",
                ["DÉVELOPPEMENT PERSONNEL"] = "JEU EN LIGNE",
                ["INTELLIGENCE ÉMOTIONNELLE"] = "ARTICLE",
                ["LOISIRS"] = "CARTE DÉFI",
                ["MONDE PROFESSIONNEL"] = "ARTICLE",
                ["PARENTALITÉ"] = "VIDÉO",
                ["QUALITÉ DE VIE"] = "COURS AU FORMAT PDF",
                ["RECHERCHE DE SENS"] = "ARTICLE",
                ["SANTÉ PHYSIQUE"] = "EXERCICE / ATELIER",
                ["SANTÉ PSYCHIQUE"] = "VIDÉO",
                ["SPIRITUALITÉ"] = "ARTICLE",
                ["VIE AFFECTIVE"] = "CARTE DÉFI"
            };

            var packs = new Dictionary<string, List<ResourceSeedDefinition>>(StringComparer.OrdinalIgnoreCase);

            foreach (var category in CategorySeeds)
            {
                packs[category.StoredName] = new List<ResourceSeedDefinition>
                {
                    BuildGenericDefinition(category, firstTypesByCategory[category.StoredName], 1),
                    BuildGenericDefinition(category, secondTypesByCategory[category.StoredName], 2),
                    BuildGenericDefinition(category, "ACTIVITÉ / JEU À RÉALISER", 3)
                };
            }

            packs["INTELLIGENCE ÉMOTIONNELLE"][0] = new ResourceSeedDefinition
            {
                CategoryName = "INTELLIGENCE ÉMOTIONNELLE",
                RelationName = "SOI",
                ResourceTypeName = "EXERCICE / ATELIER",
                UrlSlug = "intelligence-emotionnelle-reconnaitre-ses-emotions",
                Title = "Reconnaître ses émotions",
                Resume = "Exercice guidé pour identifier ses émotions, leur intensité et leurs déclencheurs.",
                Content =
                    "L’objectif de cet exercice est de reconnaître les émotions sur soi. " +
                    "Pendant une semaine, noter à des moments prédéfinis de la journée l’émotion ressentie, " +
                    "son intensité, son caractère positif ou négatif et le facteur déclencheur. " +
                    "En fin de semaine, relire ses notes pour repérer les émotions récurrentes et réfléchir " +
                    "à d’autres façons de vivre la situation.",
            };

            packs["MONDE PROFESSIONNEL"][0] = new ResourceSeedDefinition
            {
                CategoryName = "MONDE PROFESSIONNEL",
                RelationName = "PROFESSIONNELLE : COLLÈGUES, COLLABORATEURS ET MANAGERS",
                ResourceTypeName = "VIDÉO",
                UrlSlug = "monde-professionnel-emission-arte-travail-salaire-profit",
                Title = "Emission ARTE : Travail | Travail, Salaire, Profit",
                Resume = "Ressource vidéo issue de l’annexe du projet sur les enjeux du travail.",
                Content =
                    "Travail | Travail, Salaire, Profit. " +
                    "Vidéo de référence utilisable comme support de discussion sur les relations professionnelles, " +
                    "le sens du travail et la place du collectif dans l’activité.",
            };

            packs["MONDE PROFESSIONNEL"][1] = new ResourceSeedDefinition
            {
                CategoryName = "MONDE PROFESSIONNEL",
                RelationName = "PROFESSIONNELLE : COLLÈGUES, COLLABORATEURS ET MANAGERS",
                ResourceTypeName = "ARTICLE",
                UrlSlug = "monde-professionnel-rire-au-travail-et-ethique",
                Title = "Le rire au travail et l’éthique",
                Resume = "Article de réflexion sur le rire dans les situations professionnelles.",
                Content =
                    "Cet article apporte des éléments de réponse à la question du rire dans les situations professionnelles. " +
                    "Il peut servir d’appui pour discuter d’éthique, de management, de climat d’équipe et des limites " +
                    "dans les relations entre collègues et managers.",
            };

            return packs.Values.SelectMany(v => v).ToList();
        }

        private static ResourceSeedDefinition BuildGenericDefinition(
            CategorySeed category,
            string resourceTypeName,
            int slot)
        {
            var baseSlug = $"{Slugify(category.DisplayName)}-{slot}";

            return resourceTypeName switch
            {
                "ARTICLE" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-article",
                    Title = $"Repères pratiques - {category.DisplayName}",
                    Resume = $"Article d’introduction pour travailler la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"Cette ressource propose des repères concrets autour de la thématique \"{category.DisplayName}\". " +
                        $"Elle met l’accent sur les comportements utiles, les points de vigilance relationnels " +
                        $"et des pistes d’action simples à réutiliser au quotidien."
                },

                "VIDÉO" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-video",
                    Title = $"Vidéo - {category.DisplayName} au quotidien",
                    Resume = $"Vidéo courte pour découvrir des pratiques utiles sur la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"Cette vidéo sert de support de sensibilisation sur \"{category.DisplayName}\". " +
                        $"Elle peut être utilisée pour ouvrir une discussion, illustrer une situation réelle " +
                        $"et identifier des façons plus ajustées d’interagir avec les autres."
                },

                "ACTIVITÉ / JEU À RÉALISER" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-activite",
                    Title = $"Activité guidée - {category.DisplayName}",
                    Resume = $"Activité participative pour explorer la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"Cette activité propose un déroulé simple en plusieurs étapes pour travailler \"{category.DisplayName}\". " +
                        $"Elle peut être réalisée seul ou avec d’autres participants, puis prolongée par un échange " +
                        $"sur les ressentis, les besoins et les apprentissages observés."
                },

                "CARTE DÉFI" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-carte-defi",
                    Title = $"Carte défi - {category.DisplayName}",
                    Resume = $"Petit défi relationnel à mettre en pratique sur la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"La carte défi propose une action simple, limitée dans le temps, pour expérimenter autrement \"{category.DisplayName}\". " +
                        $"L’objectif est d’observer ce qui change dans la relation, dans la communication et dans le ressenti personnel."
                },

                "COURS AU FORMAT PDF" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-cours-pdf",
                    Title = $"Cours PDF - {category.DisplayName}",
                    Resume = $"Support synthétique structuré pour approfondir la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"Ce support PDF rassemble des notions clés, des exemples et quelques exercices autour de \"{category.DisplayName}\". " +
                        $"Il sert de base de compréhension avant une mise en pratique ou un échange entre participants."
                },

                "EXERCICE / ATELIER" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-atelier",
                    Title = $"Exercice guidé - {category.DisplayName}",
                    Resume = $"Exercice structuré pour travailler activement la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"Cet exercice guide l’utilisateur étape par étape afin d’identifier une situation concrète liée à \"{category.DisplayName}\", " +
                        $"de la décrire avec précision puis d’élaborer une réponse plus ajustée et plus consciente."
                },

                "FICHE DE LECTURE" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-fiche-lecture",
                    Title = $"Fiche de lecture - {category.DisplayName}",
                    Resume = $"Synthèse de lecture pour prendre du recul sur la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content =
                        $"La fiche de lecture synthétise quelques idées fortes, questions clés et pistes de réflexion liées à \"{category.DisplayName}\". " +
                        $"Elle est conçue pour faciliter l’appropriation d’un contenu plus théorique."
                },

                "JEU EN LIGNE" => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = resourceTypeName,
                    UrlSlug = $"{baseSlug}-jeu-en-ligne",
                    Title = $"Jeu en ligne - {category.DisplayName}",
                    Resume = $"Parcours interactif pour aborder la thématique {category.DisplayName.ToLowerInvariant()} de façon ludique.",
                    Content =
                        $"Ce jeu en ligne propose une série de mises en situation autour de \"{category.DisplayName}\". " +
                        $"Le participant choisit des réponses, compare les effets possibles et identifie des pistes d’amélioration."
                },

                _ => new ResourceSeedDefinition
                {
                    CategoryName = category.StoredName,
                    RelationName = category.DefaultRelationName,
                    ResourceTypeName = "ARTICLE",
                    UrlSlug = $"{baseSlug}-fallback",
                    Title = $"Ressource - {category.DisplayName}",
                    Resume = $"Ressource générique sur la thématique {category.DisplayName.ToLowerInvariant()}.",
                    Content = $"Contenu générique de démonstration pour la catégorie \"{category.DisplayName}\"."
                }
            };
        }

        private static string GetCommentText(string categoryDisplayName, int index)
        {
            return index switch
            {
                0 => $"Ressource utile pour découvrir la thématique {categoryDisplayName.ToLowerInvariant()}.",
                1 => "Le contenu est clair, simple à comprendre et facile à réutiliser.",
                _ => "Bonne base de démonstration pour tester les échanges et la progression."
            };
        }

        private static string Slugify(string value)
        {
            var normalized = value.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();

            foreach (var c in normalized)
            {
                var category = CharUnicodeInfo.GetUnicodeCategory(c);
                if (category == UnicodeCategory.NonSpacingMark)
                    continue;

                if (char.IsLetterOrDigit(c))
                {
                    builder.Append(char.ToLowerInvariant(c));
                }
                else if (char.IsWhiteSpace(c) || c == '-' || c == '/' || c == '_')
                {
                    builder.Append('-');
                }
            }

            var slug = builder.ToString();
            while (slug.Contains("--"))
            {
                slug = slug.Replace("--", "-");
            }

            return slug.Trim('-');
        }

        private sealed class DemoUsers
        {
            public UserModel Admin { get; set; } = null!;
            public UserModel Moderator { get; set; } = null!;
            public UserModel SuperAdmin { get; set; } = null!;
            public List<UserModel> Users { get; set; } = new();
        }

        private sealed class CategorySeed
        {
            public CategorySeed(string storedName, string displayName, string defaultRelationName)
            {
                StoredName = storedName;
                DisplayName = displayName;
                DefaultRelationName = defaultRelationName;
            }

            public string StoredName { get; }
            public string DisplayName { get; }
            public string DefaultRelationName { get; }
        }

        private sealed class ResourceSeedDefinition
        {
            public string Title { get; set; } = string.Empty;
            public string Resume { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public string UrlSlug { get; set; } = string.Empty;
            public string CategoryName { get; set; } = string.Empty;
            public string RelationName { get; set; } = string.Empty;
            public string ResourceTypeName { get; set; } = string.Empty;
        }
    }
}