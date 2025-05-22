package com.huir.GmaoApp.service;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.model.User;


@Service
public class PdfExportService {

    public byte[] generateUserReportPdf(User user, List<Intervention> interventions) throws DocumentException, IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();

        // Chargement du logo (depuis une URL ou depuis les ressources locales)
        try {
            // Par exemple, logo depuis ressources ou dossier static
        	Image logo = Image.getInstance("C:\\Users\\yigvyu\\GMAO1\\logo.png");
            logo.scaleToFit(100, 50);
            logo.setAbsolutePosition(15, 770);
            document.add(logo);
        } catch (Exception e) {
            // Si erreur chargement logo, on continue sans logo
            System.err.println("Logo introuvable ou erreur de chargement: " + e.getMessage());
        }

        // En-tête
        Font headerGrey = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, new BaseColor(169,169,169));
        ColumnText.showTextAligned(writer.getDirectContent(), Element.ALIGN_LEFT,
                new Phrase("H.U.I.R", headerGrey), 50, 820, 0);
        ColumnText.showTextAligned(writer.getDirectContent(), Element.ALIGN_LEFT,
                new Phrase("HOPITAL UNIVERSITAIRE INTERNATIONAL DE RABAT", headerGrey), 50, 805, 0);

        // Titre
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, new BaseColor(65, 105, 225));
        Paragraph title = new Paragraph("Fiche Utilisateur", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(40);
        document.add(title);

        // Ligne sous-titre
        PdfContentByte canvas = writer.getDirectContent();
        canvas.setLineWidth(0.3f);
        canvas.setColorStroke(new BaseColor(65, 105, 225));
        canvas.moveTo(15, 740);
        canvas.lineTo(580, 740);
        canvas.stroke();

        // Infos utilisateur
        Font labelBold = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL);
        Font blueFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.BLUE);
        Font greenFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, new BaseColor(34,139,34));
        Font redFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.RED);

        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidths(new int[]{2, 6});
        infoTable.setSpacingBefore(15);
        infoTable.setWidthPercentage(80);

        infoTable.addCell(new PdfPCell(new Phrase("Nom complet:", labelBold)));
        infoTable.addCell(new PdfPCell(new Phrase(user.getCivilite() + ". " + user.getNom(), normalFont)));

        infoTable.addCell(new PdfPCell(new Phrase("Email:", labelBold)));
        PdfPCell emailCell = new PdfPCell(new Phrase(user.getEmail(), blueFont));
        infoTable.addCell(emailCell);

        infoTable.addCell(new PdfPCell(new Phrase("Username:", labelBold)));
        infoTable.addCell(new PdfPCell(new Phrase(user.getUsername(), normalFont)));

        infoTable.addCell(new PdfPCell(new Phrase("Téléphone:", labelBold)));
        infoTable.addCell(new PdfPCell(new Phrase(user.getGsm() != null ? user.getGsm() : "Non renseigné", normalFont)));

        infoTable.addCell(new PdfPCell(new Phrase("Statut:", labelBold)));
        PdfPCell statutCell = new PdfPCell(new Phrase(user.isActif() ? "Actif" : "Inactif", user.isActif() ? greenFont : redFont));
        infoTable.addCell(statutCell);

        infoTable.addCell(new PdfPCell(new Phrase("Rôle:", labelBold)));
       

        infoTable.addCell(new PdfPCell(new Phrase("Date inscription:", labelBold)));
        infoTable.addCell(new PdfPCell(new Phrase(user.getDateInscription().toString(), normalFont)));

        document.add(infoTable);

        // Interventions si TECHNICIEN
        if ("TECHNICIEN".equals(user.getRole())) {
            Paragraph interventionsTitle = new Paragraph("Détail des interventions effectuées (" + interventions.size() + ") :", labelBold);
            interventionsTitle.setSpacingBefore(20);
            document.add(interventionsTitle);

            if (interventions.isEmpty()) {
                Paragraph noInterventions = new Paragraph("Aucune intervention enregistrée pour cet utilisateur.", new Font(Font.FontFamily.HELVETICA, 11, Font.ITALIC, new BaseColor(127, 140, 141)));
                document.add(noInterventions);
            } else {
                for (Intervention i : interventions) {
                    Paragraph p = new Paragraph();
                    p.add(new Chunk("- Type: ", labelBold));
   
                    p.add(Chunk.NEWLINE);

                    p.add(new Chunk("- Description: ", labelBold));
                    p.add(new Chunk(i.getDescription() != null ? i.getDescription() : "Aucune description", normalFont));
                    p.add(Chunk.NEWLINE);

                    p.add(new Chunk("- Remarques: ", labelBold));
                    p.add(new Chunk(i.getRemarques() != null ? i.getRemarques() : "Aucune remarque", normalFont));
                    p.setSpacingAfter(10);

                    document.add(p);

                    // Si fin de page atteint, forcer nouvelle page
                    if (writer.getVerticalPosition(true) < 80) {
                        document.newPage();
                    }
                }
            }
        }

        // Pied de page
        Font footerFont = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL, new BaseColor(169,169,169));
        ColumnText.showTextAligned(writer.getDirectContent(), Element.ALIGN_CENTER,
                new Phrase("Document généré le " + java.time.LocalDate.now() + " - H.U.I.R"), 297, 20, 0);

        document.close();

        return baos.toByteArray();
    }

    private String getRoleLabel(String role) {
        switch (role) {
            case "TECHNICIEN": return "Technicien";
            case "ADMIN": return "Administrateur";
            case "MEDECIN": return "Médecin";
            case "PATIENT": return "Patient";
            default: return "Inconnu";
        }
    }
    
    
    
    
}
