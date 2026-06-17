import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { IStatObject } from "../schemas/stats-schema";

export const exportStatsToPdf = (stats: IStatObject) => {
  const doc = new jsPDF();
  const generatedAt = new Date().toLocaleString("fr-FR");

  doc.setFontSize(18);
  doc.text("Tableau de bord - Statistiques", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Généré le ${generatedAt}`, 14, 27);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 35,
    head: [["Indicateur", "Total"]],
    body: [
      ["Utilisateurs", String(stats.totals.users)],
      ["Ressources", String(stats.totals.resources)],
      ["Commentaires", String(stats.totals.comments)],
      ["Événements", String(stats.totals.events)],
    ],
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 10 },
  });

  if (stats.usersByZone.length > 0) {
    autoTable(doc, {
      head: [["Zone géographique", "Utilisateurs"]],
      body: stats.usersByZone.map((z) => [z.zone, String(z.count)]),
      headStyles: { fillColor: [124, 58, 237] },
      styles: { fontSize: 10 },
      margin: { top: 10 },
    });
  }

  if (stats.topFavorites.length > 0) {
    autoTable(doc, {
      head: [["Ressources les plus mises en favori", "Nombre"]],
      body: stats.topFavorites.map((r) => [r.title, String(r.count)]),
      headStyles: { fillColor: [219, 39, 119] },
      styles: { fontSize: 10 },
    });
  }

  if (stats.topBookmarked.length > 0) {
    autoTable(doc, {
      head: [["Ressources les plus bookmarkées", "Nombre"]],
      body: stats.topBookmarked.map((r) => [r.title, String(r.count)]),
      headStyles: { fillColor: [234, 88, 12] },
      styles: { fontSize: 10 },
    });
  }

  const filename = `statistiques-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
