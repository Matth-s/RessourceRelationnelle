FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["RessourceRelationnelle.API/RessourceRelationnelle.API.csproj", "RessourceRelationnelle.API/"]
COPY ["RessourceRelationnelle.DATA/RessourceRelationnelle.DATA.csproj", "RessourceRelationnelle.DATA/"]

RUN dotnet restore "RessourceRelationnelle.API/RessourceRelationnelle.API.csproj"

COPY . .

WORKDIR "/src/RessourceRelationnelle.API"
RUN dotnet publish "RessourceRelationnelle.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "RessourceRelationnelle.API.dll"]
