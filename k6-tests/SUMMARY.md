# K6 Performance Tests - Synthèse

## 📦 Fichiers créés

### Workflow GitHub Actions
- **`02-3_K6LoadTest.yml`** - Orchestration des tests de performance K6 sur staging/production

### Scripts de test
- **`load-test-api.js`** - Test de charge progressive (10-50-100 VUs)
- **`stress-test-api.js`** - Test de stress haute charge (200-500 VUs)
- **`spike-test-api.js`** - Test de pics de charge soudains (up to 1000 VUs)

### Documentation
- **`README.md`** - Guide d'utilisation complet des tests K6
- **`SETUP_GUIDE.md`** - Configuration détaillée et guide de déploiement
- **`INTEGRATION.md`** - Intégration avec le workflow de staging existant
- **`examples.js`** - Exemples avancés et patterns réutilisables

### Outils de développement
- **`utils.js`** - Fonctions utilitaires partagées pour tous les tests
- **`.env.example`** - Variables d'environnement de référence

## 🚀 Prochaines étapes

### 1. Configuration des secrets GitHub
```bash
# Dans votre repository GitHub → Settings → Secrets and variables → Actions

STAGING_API_URL      → https://staging-api.example.com
K6_VUS              → 10 (ou votre valeur)
K6_DURATION         → 30s (ou votre valeur)
```

### 2. Adapter les scripts K6 à votre API

Les scripts actuels utilisent des endpoints génériques. Vous devez:

**a) Vérifier les vrais endpoints de votre API:**
```bash
# Consultez votre documentation API ou fichier controller
# Exemple pour votre backend .NET Core
GET    /api/resources
GET    /api/resource-types
GET    /api/relations
POST   /api/comments
```

**b) Mettre à jour les scripts avec vos endpoints réels:**
```javascript
// load-test-api.js - ligne 25 environ
const resourceTypesRes = http.get(`${BASE_URL}/api/votre-endpoint-reel`, {
  headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
});
```

### 3. Intégrer avec le workflow de staging

Modifiez `.github/workflows/_02_Stagging.yml`:

```yaml
  K6-Performance-Tests:
    needs: [Build_Push_Docker]
    if: ${{github.ref_name == 'develop'}}
    uses: ./.github/workflows/02-3_K6LoadTest.yml
    secrets: inherit
    with:
      environment: staging
      base_url: ${{ secrets.STAGING_API_URL }}
```

### 4. Test local d'abord

```bash
cd k6-tests

# Test simple
BASE_URL=http://localhost:5000 k6 run load-test-api.js

# Avec authentification (si nécessaire)
AUTH_TOKEN=your_token BASE_URL=http://localhost:5000 k6 run load-test-api.js
```

### 5. Ajuster les seuils de performance

Chaque script K6 définit des seuils (`thresholds`). Adaptez-les à votre SLA:

```javascript
thresholds: {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],  // Adaptez ces valeurs
  http_req_failed: ['rate<0.1'],                    // Adaptez ce taux
},
```

## 📊 Structure des tests

### Load Test (Test de charge progressive)
- **Profil**: 20 VUs → 50 VUs → 100 VUs (8 minutes)
- **Objectif**: Simuler une montée progressive d'utilisateurs
- **Thresholds**: 
  - P95 < 500ms
  - P99 < 1000ms
  - Erreurs < 10%

### Stress Test (Test de charge soutenue)
- **Profil**: 200 VUs → 500 VUs (16 minutes)
- **Objectif**: Déterminer le point de rupture du système
- **Thresholds**:
  - P95 < 1000ms
  - P99 < 2000ms
  - Erreurs < 20%

### Spike Test (Test de pics)
- **Profil**: Pics soudains (50 → 500 → 1000 VUs)
- **Objectif**: Tester la résilience aux pics de trafic
- **Thresholds**:
  - P99 < 3000ms
  - Erreurs < 30%

## 🔧 Utilisation pratique

### Exécution manuelle sur GitHub
1. Actions → 02-3 - Performance - K6 Load Test
2. Run workflow
3. Sélectionner l'environnement
4. Visualiser les résultats

### Exécution automatique (après intégration)
- Tous les déploiements sur `develop` déclenchent les tests K6
- Les résultats apparaissent dans le workflow summary
- Erreurs bloquantes si seuils dépassés (adaptez selon vos besoins)

## 📈 Interprétation des résultats

| Métrique | Bon | Attention | Mauvais |
|----------|-----|-----------|--------|
| P95 Response | < 500ms | 500-1000ms | > 1000ms |
| P99 Response | < 1000ms | 1-2s | > 2s |
| Error Rate | < 5% | 5-15% | > 15% |
| Throughput | > 200/s | 100-200/s | < 100/s |

## 🎯 Cas d'usage avancés

### 1. Tests avec authentification
```bash
AUTH_TOKEN=your_jwt_token BASE_URL=https://staging-api.example.com k6 run load-test-api.js
```

### 2. Tests avec sortie JSON
```bash
k6 run --out=json=results.json load-test-api.js
```

### 3. Tests avec InfluxDB
```bash
K6_OUT=influxdb=http://localhost:8086/k6 k6 run load-test-api.js
```

### 4. Modifier le nombre de VUs
```bash
K6_VUS=50 k6 run load-test-api.js
```

## 📚 Ressources

- [K6 Documentation](https://k6.io/docs/)
- [K6 API Reference](https://k6.io/docs/javascript-api/)
- [GitHub Actions Guide](k6-tests/INTEGRATION.md)
- [Setup Detailed Guide](k6-tests/SETUP_GUIDE.md)
- [Exemples avancés](k6-tests/examples.js)

## ⚠️ Points importants

1. **Adapter à votre API** : Les scripts actuels sont des templates. Mettez à jour les URLs et payloads.

2. **Secrets GitHub** : Configurez les secrets avant de lancer les tests en CI/CD.

3. **Seuils adaptés** : Ajustez les thresholds selon votre SLA et infrastructure.

4. **Test local d'abord** : Testez toujours localement avant d'exécuter en CI/CD.

5. **Monitoring** : Gardez un historique des résultats pour détecter les dégradations.

## ✅ Checklist de déploiement

- [ ] Adapter les endpoints K6 à votre API
- [ ] Configurer les secrets GitHub
- [ ] Tester localement au moins une fois
- [ ] Intégrer avec le workflow de staging
- [ ] Valider les seuils de performance
- [ ] Documenter vos SLAs
- [ ] Former l'équipe à l'utilisation

## 🆘 Troubleshooting rapide

| Problème | Solution |
|----------|----------|
| Connection refused | Vérifiez BASE_URL et que l'API est accessible |
| Auth failures | Vérifiez AUTH_TOKEN et endpoints d'authentification |
| Seuils dépassés | Vérifiez les logs API, infrastructure, et récentes déployments |
| Scripts non trouvés | Vérifiez que k6-tests/ existe et contient les fichiers |

---

**Créé le**: 2026-06-18  
**Pour**: RessourceRelationnelle  
**Type**: Tests de performance K6 pour staging
