package com.huir.GmaoApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "nom"),
        @UniqueConstraint(columnNames = "gsm")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Le nom ne peut pas être vide")
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Civilite civilite;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "L'email ne peut pas être vide")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@huir\\.ma$", message = "L'email doit se terminer par @huir.ma")
    private String email;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Le nom d'utilisateur ne peut pas être vide")
    private String username;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Pattern(
            regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$",
            message = "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)"
    )
    private String password;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Size(min = 10, max = 10, message = "Le numéro de téléphone doit contenir exactement 10 chiffres")
    @Pattern(regexp = "\\d{10}", message = "Le numéro de téléphone ne doit contenir que des chiffres")
    private String gsm;

    @Column
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private boolean actif = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateInscription = LocalDateTime.now();

    @JsonIgnore
    @JsonManagedReference("user-creePar")
    @OneToMany(mappedBy = "creePar", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MaintenanceCorrective> maintenancesCreees;

    @JsonIgnore
    @JsonManagedReference("user-affecteA")
    @OneToMany(mappedBy = "affecteA", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MaintenanceCorrective> maintenancesAssignees;

    @JsonIgnore
    @JsonManagedReference("user-intervention")
    @OneToMany(mappedBy = "technicien", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Intervention> interventions;
}
