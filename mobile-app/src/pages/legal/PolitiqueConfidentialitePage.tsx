import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PolitiqueConfidentialitePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Politique de Confidentialité</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Collecte des données personnelles</h2>
              <p className="mb-2">
                Dans le cadre de l'utilisation de la plateforme (RE)SOURCES RELATIONNELLES, nous pouvons être 
                amenés à collecter les données personnelles suivantes :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Données d'identification (nom, prénom, adresse e-mail) lors de la création d'un compte.</li>
                <li>Données de connexion et d'utilisation (adresse IP, logs de connexion).</li>
                <li>Contenus que vous choisissez de partager (ressources, commentaires, statistiques de jeu).</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Utilisation des données</h2>
              <p className="mb-2">Les données collectées sont utilisées pour les finalités suivantes :</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Gérer votre compte utilisateur et vous permettre d'accéder aux services de la plateforme.</li>
                <li>Améliorer et personnaliser votre expérience utilisateur.</li>
                <li>Gérer les interactions communautaires (commentaires, création de ressources).</li>
                <li>Assurer la sécurité de la plateforme et prévenir les fraudes.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Partage des données</h2>
              <p>
                Vos données personnelles ne sont ni vendues ni louées à des tiers. Elles peuvent être partagées 
                uniquement avec nos prestataires techniques (hébergement, maintenance) dans le cadre strict 
                de l'exécution de leurs services, en conformité avec la réglementation en vigueur.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Durée de conservation</h2>
              <p>
                Vos données personnelles sont conservées pendant toute la durée de votre inscription sur 
                la plateforme. En cas de suppression de votre compte, vos données seront effacées ou 
                anonymisées dans un délai de 30 jours, à l'exception des données nécessaires au respect 
                d'obligations légales.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Vos droits</h2>
              <p className="mb-2">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des 
                droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mb-2">
                <li>Droit d'accès et de rectification.</li>
                <li>Droit à l'effacement (droit à l'oubli).</li>
                <li>Droit à la limitation du traitement.</li>
                <li>Droit à la portabilité de vos données.</li>
                <li>Droit d'opposition.</li>
              </ul>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : 
                <a href="mailto:contact@resources-relationnelles.fr" className="text-blue-600 hover:underline ml-1">contact@resources-relationnelles.fr</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialitePage;
