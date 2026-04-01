# 1. Étape de Build (utilise le SDK complet .NET 9)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# On copie d'abord uniquement les fichiers projets (.csproj)
# Cela permet à Docker de mettre en cache la restauration des paquets (plus rapide pour les prochains builds)
COPY ["RessourceRelationnelle.API/RessourceRelationnelle.API.csproj", "RessourceRelationnelle.API/"]
COPY ["RessourceRelationnelle.DATA/RessourceRelationnelle.DATA.csproj", "RessourceRelationnelle.DATA/"]

# On restaure les dépendances sur le projet principal (qui va tirer le projet DATA)
RUN dotnet restore "RessourceRelationnelle.API/RessourceRelationnelle.API.csproj"

# On copie le reste du code source
COPY . .

# On se place dans le dossier de l'API et on compile en mode Release
WORKDIR "/src/RessourceRelationnelle.API"
RUN dotnet publish "RessourceRelationnelle.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Étape d'Exécution (utilise l'image allégée ASP.NET Core 9 pour la production)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# On expose le port standard par défaut (souvent 8080 en .NET 8 et 9)
EXPOSE 8080

# On récupère le résultat de l'étape de build
COPY --from=build /app/publish .

# Commande de démarrage
ENTRYPOINT ["dotnet", "RessourceRelationnelle.API.dll"]