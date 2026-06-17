import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MentionsLegalesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mentions Légales</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Éditeur du site</h2>
              <p className="mb-2">Le site (RE)SOURCES RELATIONNELLES est édité par le Ministère des Solidarités et de la Santé.</p>
              <p className="mb-2"><strong>Adresse :</strong> 14 avenue Duquesne, 75350 Paris 07 SP, France</p>
              <p><strong>Directeur de la publication :</strong> Le Ministre des Solidarités et de la Santé.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Hébergement</h2>
              <p className="mb-2">Ce site est hébergé par :</p>
              <p className="mb-2"><strong>JSP</strong></p>
              <p>2 rue Jsp, quelques part, France</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Protection des données personnelles</h2>
              <p className="mb-2">
                Conformément à la loi "Informatique et Libertés" et au Règlement Général sur la Protection 
                des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression 
                et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter via l'adresse email : 
                <a href="mailto:contact@resources-relationnelles.fr" className="text-blue-600 hover:underline ml-1">contact@resources-relationnelles.fr</a>
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
              <p>
                Le site utilise des cookies strictement nécessaires à son fonctionnement. Aucune donnée personnelle 
                n'est collectée à des fins commerciales sans votre consentement explicite.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegalesPage;
