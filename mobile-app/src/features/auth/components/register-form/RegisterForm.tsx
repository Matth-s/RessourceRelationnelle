import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { registerApi } from '../../api/register-api';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const acceptTerms = watch('acceptTerms');
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);
    try {
      await registerApi({
        email: data.email,
        username: `${data.firstName}.${data.lastName}`.toLowerCase(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate('/auth/login');
    } catch {
      setError(
        'Une erreur est survenue lors de la création du compte',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold leading-tight text-center">
              RE
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Créer un compte
        </h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Rejoignez notre communauté en quelques clics
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Prénom
              </label>
              <input
                aria-label="firstname"
                type="text"
                placeholder="Jean"
                className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register('firstName', { required: 'Requis' })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom
              </label>
              <input
                aria-label="lastname"
                type="text"
                placeholder="Dupont"
                className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register('lastName', { required: 'Requis' })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                aria-label="email"
                type="email"
                placeholder="votre@email.fr"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register('email', {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email invalide',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                data-testid="password-input"
                aria-label="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register('password', {
                  required: 'Le mot de passe est requis',
                  minLength: {
                    value: 6,
                    message: '6 caractères minimum',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                data-testid="confirm-password-input"
                aria-label="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                {...register('confirmPassword', {
                  required: 'La confirmation est requise',
                  validate: (value) =>
                    value === password ||
                    'Les mots de passe ne correspondent pas',
                })}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <input
              aria-label="acceptTerms"
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('acceptTerms', {
                required: 'Vous devez accepter les conditions',
              })}
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-tight"
            >
              J'accepte les{' '}
              <Link
                to="/cgu"
                className="text-blue-600 hover:underline"
              >
                conditions générales d'utilisation
              </Link>{' '}
              et la{' '}
              <Link
                to="/politique-confidentialite"
                className="text-blue-600 hover:underline"
              >
                politique de confidentialité
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs -mt-3">
              {errors.acceptTerms.message}
            </p>
          )}

          <button
            aria-label="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={!acceptTerms || loading}
            className={`w-full py-3.5 rounded-xl font-medium text-sm transition-colors ${acceptTerms ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} disabled:opacity-50`}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-sm text-gray-400">Ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link
            to="/auth/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
