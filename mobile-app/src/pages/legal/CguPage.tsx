import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const CguPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Conditions Générales d'Utilisation</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités 
                de mise à disposition des services du site (RE)SOURCES RELATIONNELLES, ainsi que les conditions 
                d'utilisation de ces services par l'utilisateur.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Accès au site</h2>
              <p>
                L'éditeur s'efforce de permettre l'accès au site 24 heures sur 24, 7 jours sur 7, sauf en cas de 
                force majeure ou d'un événement hors de son contrôle, et sous réserve des éventuelles pannes et 
                interventions de maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Responsabilité de l'utilisateur</h2>
              <p>
                L'utilisateur est seul responsable de l'utilisation qu'il fait du site et des services auxquels 
                il accède. Il s'engage à respecter les lois en vigueur et à ne pas publier de contenus 
                illicites ou préjudiciables.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CguPage;
