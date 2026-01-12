# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project files
COPY ["src/HandimanApp.API/HandimanApp.API.csproj", "src/HandimanApp.API/"]
COPY ["src/HandimanApp.Core/HandimanApp.Core.csproj", "src/HandimanApp.Core/"]
COPY ["src/HandimanApp.Infrastructure/HandimanApp.Infrastructure.csproj", "src/HandimanApp.Infrastructure/"]

# Restore packages
RUN dotnet restore "src/HandimanApp.API/HandimanApp.API.csproj"

# Copy everything
COPY . .

# Build
RUN dotnet build "src/HandimanApp.API/HandimanApp.API.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "src/HandimanApp.API/HandimanApp.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 5000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "HandimanApp.API.dll"]
