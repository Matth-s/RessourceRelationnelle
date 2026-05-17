import { useState } from "react";
import { useForm } from "react-hook-form";
import { currentUserSchema } from "@/features/user/schemas/current-user-schema";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/auth.slice";
import { loginApi } from "../../api/login-api";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginApi(data);
      localStorage.setItem("auth_token", response.token);
      
      const validatedUser = currentUserSchema.parse({
        username: response.username,
        role: response.role,
        token: response.token,
      });

      dispatch(login(validatedUser));
      
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect, ou données invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold leading-tight text-center">RE</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Bon retour !</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Connectez-vous pour accéder à votre espace</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="votre@email.fr"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register("email", { required: "L'email est requis", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email invalide" } })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register("password", { required: "Le mot de passe est requis" })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</a>
          </div>

          <button onClick={handleSubmit(onSubmit)} disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-sm text-gray-400">Ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">Créer un compte</Link>
        </p>
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-center justify-center gap-2">
        <ShieldCheck className="h-5 w-5 text-yellow-500" />
        <p className="text-sm text-gray-600">Vos données sont sécurisées et ne seront jamais partagées</p>
      </div>
    </div>
  );
};

export default LoginForm;
