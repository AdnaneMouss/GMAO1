import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeClass = 'dark'; // Nom de la classe pour activer le mode sombre
  private storageKey = 'theme-mode'; // Clé pour stocker la préférence dans le localStorage

  constructor() {
    this.loadTheme();
  }

  // Bascule le thème en fonction de l'état du toggle
  toggleTheme(isDark: boolean) {
    const root = document.documentElement; // On cible l'élément <html>

    if (isDark) {
      root.classList.add(this.darkThemeClass); // Ajoute la classe 'dark'
      localStorage.setItem(this.storageKey, 'dark'); // Sauvegarde le mode sombre
    } else {
      root.classList.remove(this.darkThemeClass); // Retire la classe 'dark'
      localStorage.setItem(this.storageKey, 'light'); // Sauvegarde le mode clair
    }
  }

  // Charge le thème sauvegardé dans le localStorage lors du démarrage de l'app
  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add(this.darkThemeClass); // Si mode sombre, ajoute la classe
    } else {
      document.documentElement.classList.remove(this.darkThemeClass); // Si mode clair, la classe est retirée
    }
  }

  // Vérifie si le thème actuel est le mode sombre
  isDarkMode(): boolean {
    return document.documentElement.classList.contains(this.darkThemeClass); // Retourne si le mode sombre est activé
  }
}
