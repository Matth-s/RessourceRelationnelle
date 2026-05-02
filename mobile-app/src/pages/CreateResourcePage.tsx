import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  Film,
  Music,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  type Category,
  type TypeRelation,
  type TypeResource,
  getCategoriesApi,
  getTypeRelationsApi,
  getTypeResourcesApi,
  createResourceApi,
} from "@/features/resources/api/resources-api";

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov,.mp3,.pdf";

const getFileIcon = (file: File) => {
  const type = file.type;
  if (type.startsWith("image/")) return <Image className="h-8 w-8 text-blue-500" />;
  if (type.startsWith("video/")) return <Film className="h-8 w-8 text-purple-500" />;
  if (type.startsWith("audio/")) return <Music className="h-8 w-8 text-green-500" />;
  if (type === "application/pdf") return <FileText className="h-8 w-8 text-red-500" />;
  return <FileText className="h-8 w-8 text-gray-500" />;
};

const CreateResourcePage = () => {
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
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [cats, rels, types] = await Promise.all([
          getCategoriesApi(),
          getTypeRelationsApi(),
          getTypeResourcesApi(),
        ]);
        setCategories(cats);
        setTypeRelations(rels);
        setTypeResources(types);
      } catch {
        setError("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 50 Mo");
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !resume.trim() || !content.trim() || !categoryId || !relationTypeId || !resourceTypeId) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Resume", resume);
      formData.append("Content", content);
      formData.append("CategoryId", categoryId);
      formData.append("RelationTypeId", relationTypeId);
      formData.append("ResourceTypeId", resourceTypeId);
      if (file) {
        formData.append("File", file);
      }
      if (url.trim()) {
        formData.append("Url", url);
      }

      await createResourceApi(formData);
      navigate("/resources");
    } catch {
      setError("Erreur lors de la création de la ressource");
    } finally {
      setLoading(false);
    }
  };

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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer une ressource</h1>
        <p className="text-gray-500 text-sm mb-6">
          Partagez vos connaissances avec la communauté
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>
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
              placeholder="Titre de votre ressource"
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
              placeholder="Un court résumé de votre ressource"
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
              placeholder="Le contenu détaillé de votre ressource"
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

          {/* URL YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lien YouTube (optionnel)
            </label>
            <div className="relative">
              <Film className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Collez un lien YouTube pour intégrer une vidéo</p>
          </div>

          {/* Upload fichier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fichier (image, vidéo, audio, PDF — optionnel)
            </label>
            {file ? (
              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} Mo
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Cliquez pour sélectionner un fichier</span>
                <span className="text-xs text-gray-400">Images, vidéos, audio, PDF (max 50 Mo)</span>
                <input
                  type="file"
                  accept={ACCEPTED_TYPES}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Publier la ressource"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateResourcePage;