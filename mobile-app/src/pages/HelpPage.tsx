import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HelpCircle, Mail } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Comment pouvons-nous vous aider ?</h1>
            <p className="text-gray-600 text-lg">Retrouvez les réponses à vos questions ou contactez-nous.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center max-w-sm w-full">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Nous Contacter</h3>
              <p className="text-sm text-gray-500 mb-4">Une question spécifique ? Notre équipe vous répond.</p>
              <a href="mailto:contact@resources-relationnelles.fr" className="text-purple-600 text-sm font-medium hover:underline">Envoyer un message</a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Questions Fréquentes (FAQ)</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment créer une ressource ?</h3>
                <p className="text-gray-600">
                  Pour créer une ressource, vous devez d'abord vous connecter à votre compte. 
                  Ensuite, cliquez sur le bouton "+ Créer" ou "+ Créer une ressource" dans le menu de navigation.
                  Remplissez le formulaire avec les détails de votre ressource et validez.
                </p>
              </div>
              
              <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Qui peut voir mes ressources ?</h3>
                <p className="text-gray-600">
                  Les ressources que vous publiez sont publiques et visibles par tous les 
                  utilisateurs de la plateforme, sauf si vous décidez de les restreindre lors de la création 
                  ou de l'édition (fonctionnalité à venir).
                </p>
              </div>

              <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment modifier mon mot de passe ?</h3>
                <p className="text-gray-600">
                  Rendez-vous sur votre page de profil en cliquant sur votre nom d'utilisateur en haut à droite. 
                  Vous y trouverez une section permettant de mettre à jour vos informations personnelles ainsi 
                  que votre mot de passe.
                </p>
              </div>

              <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment signaler un contenu inapproprié ?</h3>
                <p className="text-gray-600">
                  Vous pouvez nous contacter notre <a href="mailto:contact@resources-relationnelles.fr" className="text-blue-600">adresse email</a> pour signaler le contenu à nos équipes de modération qui le traiteront dans les 
                  plus brefs délais .
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpPage;
