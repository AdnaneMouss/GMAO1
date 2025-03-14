package com.huir.GmaoApp.controller;

import com.huir.GmaoApp.dto.UserDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.repository.EquipementRepository;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import com.huir.GmaoApp.repository.UserRepository;
import com.huir.GmaoApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EquipementRepository equipementRepository;
    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;


    //Users

    @GetMapping("/user/role-counts")
    public ResponseEntity<Map<String, Long>> getUserRoleCounts() {
        Map<String, Long> roleCounts = userRepository.findAll().stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                user -> user.getRole().name(), // Assuming Role is an Enum
                                java.util.stream.Collectors.counting()
                        )
                );
        return ResponseEntity.ok(roleCounts);
    }

    @GetMapping("/user/status-counts")
    public ResponseEntity<Map<String, Long>> getUserStatusCounts() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActif(true);
        long inactiveUsers = userRepository.countByActif(false);

        Map<String, Long> counts = Map.of(
                "total", totalUsers,
                "active", activeUsers,
                "inactive", inactiveUsers
        );

        return ResponseEntity.ok(counts);
    }

    @GetMapping("/user/registrations-per-month")
    public ResponseEntity<Map<String, Long>> getUserRegistrationsPerMonth() {
        Map<String, Long> registrationsPerMonth = userRepository.findAll().stream()
                .filter(user -> user.getDateInscription() != null)
                .collect(Collectors.groupingBy(
                        user -> {
                            LocalDateTime dateTime = user.getDateInscription();
                            return dateTime.getYear() + "-" + String.format("%02d", dateTime.getMonthValue()); // e.g., "2025-05"
                        },
                        Collectors.counting()
                ));

        return ResponseEntity.ok(registrationsPerMonth);
    }

    //Equipements


    @GetMapping("/equipement/count")
    public long getTotalEquipements() {
        return equipementRepository.count();
    }

    @GetMapping("/equipement/by-statut")
    public ResponseEntity<Map<String, Long>> countByStatut() {
        long total = equipementRepository.count();
        long enService = equipementRepository.countByStatut(StatutEquipement.EN_SERVICE);
        long enPanne = equipementRepository.countByStatut(StatutEquipement.EN_PANNE);
        long enMaintenance = equipementRepository.countByStatut(StatutEquipement.EN_MAINTENANCE);

        Map<String, Long> counts = Map.of(
                "total", total,
                "EN_SERVICE", enService,
                "EN_PANNE", enPanne,
                "EN_MAINTENANCE", enMaintenance
        );

        return ResponseEntity.ok(counts);
    }


    @GetMapping("/equipement/by-marque")
    public Map<String, Long> countByMarque() {
        return equipementRepository.findAll().stream()
                .collect(Collectors.groupingBy(Equipement::getMarque, Collectors.counting()));
    }

    @GetMapping("/equipement/by-type")
    public Map<String, Long> countByTypeEquipement() {
        return equipementRepository.findAll().stream()
                .filter(e -> e.getTypeEquipement() != null && e.getTypeEquipement().getType() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getTypeEquipement().getType(),
                        Collectors.counting()
                ));
    }

    @GetMapping("/equipement/by-service")
    public Map<String, Long> countByService() {
        return equipementRepository.findAll().stream()
                .collect(Collectors.groupingBy(e -> e.getService().getNom(), Collectors.counting()));
    }

    @GetMapping("/equipement/expired-garantie")
    public long countWithExpiredGarantie() {
        LocalDate today = LocalDate.now();
        return equipementRepository.findAll().stream()
                .filter(e -> {
                    try {
                        String garantie = e.getGarantie();
                        if (garantie != null && !garantie.isBlank()) {
                            // Extract number of years from "1 an", "2 ans", "3 ANS", etc.
                            Matcher matcher = Pattern.compile("(\\d+)").matcher(garantie);
                            if (matcher.find()) {
                                int years = Integer.parseInt(matcher.group(1));
                                LocalDate expiryDate = e.getDateAchat().plusYears(years);
                                return expiryDate.isBefore(today);
                            }
                        }
                    } catch (Exception ex) {
                        // Optional: log error
                    }
                    return false;
                })
                .count();
    }


    @GetMapping("/equipement/total-cost")
    public double totalCost() {
        return equipementRepository.findAll().stream()
                .mapToDouble(e -> e.getCoutAchat() != null ? e.getCoutAchat() : 0)
                .sum();
    }

    @GetMapping("/equipement/without-recent-maintenance")
    public long countWithoutRecentMaintenance() {
        LocalDate cutoff = LocalDate.now().minusMonths(6);
        return equipementRepository.findAll().stream()
                .filter(e -> e.getDateDerniereMaintenance() == null || e.getDateDerniereMaintenance().isBefore(cutoff))
                .count();
    }

    @GetMapping("/equipement/above-threshold")
    public long countAboveThreshold() {
        return equipementRepository.findAll().stream()
                .filter(e -> e.getValeurSuivi() > 100) // or any threshold you define
                .count();
    }

    @GetMapping("/piece/count")
    public ResponseEntity<Long> getTotalPieces() {
        return ResponseEntity.ok(pieceDetacheeRepository.count());
    }

    // 📦 2. Count by stock status (Rupture / Stock bas / Disponible)
    @GetMapping("/piece/status-counts")
    public ResponseEntity<Map<String, Long>> getPieceStatusCounts() {
        long totalPieces = pieceDetacheeRepository.count();

        // Count for each status
        long ruptureCount = pieceDetacheeRepository.findAll().stream()
                .filter(p -> "Rupture".equals(p.getStatut()))
                .count();

        long stockBasCount = pieceDetacheeRepository.findAll().stream()
                .filter(p -> "Stock bas".equals(p.getStatut()))
                .count();

        long disponibleCount = pieceDetacheeRepository.findAll().stream()
                .filter(p -> "Disponible".equals(p.getStatut()))
                .count();

        Map<String, Long> counts = Map.of(
                "total", totalPieces,
                "rupture", ruptureCount,
                "stockBas", stockBasCount,
                "disponible", disponibleCount
        );

        return ResponseEntity.ok(counts);
    }


    // 📈 3. Total purchases per month (yyyy-MM)
    @GetMapping("/piece/purchases-per-month")
    public ResponseEntity<Map<String, Long>> getPurchasesPerMonth() {
        List<AchatPiece> allAchats = pieceDetacheeRepository.findAll().stream()
                .flatMap(p -> p.getAchats().stream())
                .filter(achat -> achat.getDateAchat() != null)
                .collect(Collectors.toList());

        Map<String, Long> perMonth = allAchats.stream()
                .collect(Collectors.groupingBy(
                        achat -> {
                            LocalDate date = achat.getDateAchat();
                            return date.getYear() + "-" + String.format("%02d", date.getMonthValue());
                        },
                        Collectors.counting()
                ));

        return ResponseEntity.ok(perMonth);
    }

    // 💰 4. Average quantity per purchase
    @GetMapping("/piece/average-quantity")
    public ResponseEntity<Double> getAverageQuantityPerPurchase() {
        List<AchatPiece> achats = pieceDetacheeRepository.findAll().stream()
                .flatMap(p -> p.getAchats().stream())
                .collect(Collectors.toList());

        double average = achats.stream()
                .mapToInt(AchatPiece::getQuantite)
                .average()
                .orElse(0.0);

        return ResponseEntity.ok(average);
    }

    // 🧾 5. Average unit cost (across all purchases)
    @GetMapping("/piece/average-unit-cost")
    public ResponseEntity<Double> getAverageUnitCost() {
        List<AchatPiece> achats = pieceDetacheeRepository.findAll().stream()
                .flatMap(p -> p.getAchats().stream())
                .collect(Collectors.toList());

        double average = achats.stream()
                .mapToDouble(AchatPiece::getCoutUnitaire)
                .average()
                .orElse(0.0);

        return ResponseEntity.ok(average);
    }

    // 💸 6. Total cost of all purchases
    @GetMapping("/piece/total-purchase-cost")
    public ResponseEntity<Double> getTotalPurchaseCost() {
        double total = pieceDetacheeRepository.findAll().stream()
                .flatMap(p -> p.getAchats().stream())
                .mapToDouble(achat -> achat.getCoutUnitaire() * achat.getQuantite())
                .sum();

        return ResponseEntity.ok(total);
    }

    // 🧑‍💼 7. Piece count grouped by supplier
    @GetMapping("/piece/supplier-counts")
    public ResponseEntity<Map<String, Long>> getPieceCountsBySupplier() {
        List<PieceDetachee> pieces = pieceDetacheeRepository.findAll();

        Map<String, Long> byFournisseur = pieces.stream()
                .collect(Collectors.groupingBy(
                        PieceDetachee::getFournisseur,
                        Collectors.counting()
                ));

        return ResponseEntity.ok(byFournisseur);
    }
}




