import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search, SlidersHorizontal, Eye, Heart, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { type Resource, getResourcesApi } from "@/features/resources/api/get-resources-api";
import { type Category, getCategoriesApi } from "@/features/resources/api/get-categories-api";
import { type TypeRelation, getTypeRelationsApi } from "@/features/resources/api/get-types-relation-api";
import { type TypeResource, getTypeResourcesApi } from "@/features/resources/api/get-types-resources-api";

const CATEGORY_COLORS: Record<string, string> = {
  "COMMUNICATION": "bg-blue-100 text-blue-700",
  "CULTURES": "bg-green-100 text-green-700",
  "DÉVELOPPEMENT PERSONNEL": "bg-purple-100 text-purple-700",
  "INTELLIGENCE ÉMOTIONNELLE": "bg-amber-100 text-amber-700",
  "LOISIRS": "bg-pink-100 text-pink-700",
  "MONDE PROFESSIONNEL": "bg-indigo-100 text-indigo-700",
  "PARENTALITÉ": "bg-rose-100 text-rose-700",
  "QUALITÉ DE VIE": "bg-teal-100 text-teal-700",
  "RECHERCHE DE SENS": "bg-cyan-100 text-cyan-700",
  "SANTÉ PHYSIQUE": "bg-lime-100 text-lime-700",
  "SANTÉ PSYCHIQUE": "bg-violet-100 text-violet-700",
  "SPIRITUALITÉ": "bg-fuchsia-100 text-fuchsia-700",
  "VIE AFFECTIVE": "bg-red-100 text-red-700",
};

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [typeRelations, setTypeRelations] = useState<TypeRelation[]>([]);
  const [typeResources, setTypeResources] = useState<TypeResource[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, cats, rels, types] = await Promise.all([
          getResourcesApi(),
          getCategoriesApi(),
          getTypeRelationsApi(),
          getTypeResourcesApi(),
        ]);
        setResources(res);
        setCategories(cats);
        setTypeRelations(rels);
        setTypeResources(types);
      } catch (err) {
        console.error("Erreur chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeFiltersCount = [selectedCategory, selectedRelation, selectedType].filter(Boolean).length;

  const filtered = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.resume.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? r.category?.categoryName === selectedCategory : true;
    const matchRelation = selectedRelation ? r.typeRelation?.typeRelation === selectedRelation : true;
    const matchType = selectedType ? r.typeRessource?.typeRessource === selectedType : true;
    return matchSearch && matchCategory && matchRelation && matchType;
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedRelation("");
    setSelectedType("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 px-4 py-6 md:py-10 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Explorer les ressources</h1>
        <p className="text-gray-500 text-sm mb-6">Découvrez des centaines de ressources pour améliorer vos relations</p>

        {/* Recherche + Filtres */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm relative ${
              showFilters ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-600"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-900">Filtres</h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Tout effacer
                </button>
              )}
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Catégorie</label>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip label="Toutes" active={selectedCategory === ""} onClick={() => setSelectedCategory("")} />
                {categories.map((cat) => (
                  <FilterChip key={cat.id} label={cat.categoryName} active={selectedCategory === cat.categoryName} onClick={() => setSelectedCategory(cat.categoryName)} />
                ))}
              </div>
            </div>

            {/* Type de relation */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Type de relation</label>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip label="Toutes" active={selectedRelation === ""} onClick={() => setSelectedRelation("")} />
                {typeRelations.map((rel) => (
                  <FilterChip key={rel.id} label={rel.typeRelation} active={selectedRelation === rel.typeRelation} onClick={() => setSelectedRelation(rel.typeRelation)} />
                ))}
              </div>
            </div>

            {/* Type de ressource */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Type de ressource</label>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip label="Tous" active={selectedType === ""} onClick={() => setSelectedType("")} />
                {typeResources.map((type) => (
                  <FilterChip key={type.id} label={type.typeRessource} active={selectedType === type.typeRessource} onClick={() => setSelectedType(type.typeRessource)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compteur */}
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-900">{filtered.length}</span> ressources trouvées
        </p>

        {loading && <p className="text-center text-gray-400 py-10">Chargement...</p>}

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">Aucune ressource trouvée</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
      active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const categoryName = resource.category?.categoryName ?? "";
  const typeName = resource.typeRessource?.typeRessource ?? "";
  const categoryColor = CATEGORY_COLORS[categoryName] ?? "bg-gray-100 text-gray-700";

  return (
    <Link to={`/resources/${resource.id}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative">
        {typeName && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full">{typeName}</span>
        )}
      </div>
      <div className="p-4">
        {categoryName && (
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 ${categoryColor}`}>{categoryName}</span>
        )}
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{resource.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{resource.resume}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />—</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />—</span>
          </div>
          <span>{resource.user?.userName ?? "Anonyme"}</span>
        </div>
      </div>
    </Link>
  );
};

export default ResourcesPage;