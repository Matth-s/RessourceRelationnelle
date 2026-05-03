import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  type Category,
  type TypeRelation,
  type TypeResource,
  getCategoriesApi,
  getTypeRelationsApi,
  getTypeResourcesApi,
  getResourceByIdApi,
  updateResourceApi,
} from "@/features/resources/api/resources-api";

const EditResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [typeRelations, setTypeRelations] = useState<TypeRelation[]>([]);
  const [typeResources, setTypeResources] = useState<TypeResource[]>([]);

  const [title, setTitle] = useState("");
  const [resume, setResume] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [relationTypeId, setRelationTypeId] = useState("");
  const [resourceTypeId, setResourceTypeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const fetchData = async () => {
      if (!id) return;
      try {
        const [resource, cats, rels, types] = await Promise.all([
          getResourceByIdApi(id),
          getCategoriesApi(),
          getTypeRelationsApi(),
          getTypeResourcesApi(),
        ]);

        setTitle(resource.title);
        setResume(resource.resume);
        setContent(resource.content);
        setCategoryId(resource.category?.id ?? "");
        setRelationTypeId(resource.typeRelation?.id ?? "");
        setResourceTypeId(resource.typeResource?.id ?? "");
        setCategories(cats);
        setTypeRelations(rels);
        setTypeResources(types);
      } catch {
        setError("Impossible de charger la ressource");
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleSubmit = async () => {
    if (!id || !title.trim() || !resume.trim() || !content.trim() || !categoryId || !relationTypeId || !resourceTypeId) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateResourceApi({
        id,
        title,
        resume,
        content,
        categoryId,
        resourceTypeId,
        relationTypeId,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/resources/${id}`), 1500);
    } catch {
      setError("Erreur lors de la modification de la ressource");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Modifier la ressource</h1>
        <p className="text-gray-500 text-sm mb-6">
          Modifiez les informations de votre ressource
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-sm rounded-xl p-3 mb-4">
            Ressource modifiée avec succès ! Redirection...
          </div>
        )}

        <div className="space-y-5">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Résumé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Résumé <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contenu <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Type de relation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type de relation <span className="text-red-500">*</span>
            </label>
            <select
              value={relationTypeId}
              onChange={(e) => setRelationTypeId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sélectionner un type de relation</option>
              {typeRelations.map((rel) => (
                <option key={rel.id} value={rel.id}>{rel.typeRelation}</option>
              ))}
            </select>
          </div>

          {/* Type de ressource */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type de ressource <span className="text-red-500">*</span>
            </label>
            <select
              value={resourceTypeId}
              onChange={(e) => setResourceTypeId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sélectionner un type de ressource</option>
              {typeResources.map((type) => (
                <option key={type.id} value={type.id}>{type.typeRessource}</option>
              ))}
            </select>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Modification..." : "Enregistrer les modifications"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl font-medium text-sm hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditResourcePage;