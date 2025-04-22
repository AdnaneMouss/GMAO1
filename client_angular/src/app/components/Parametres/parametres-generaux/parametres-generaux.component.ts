import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametres-generaux',
  templateUrl: './parametres-generaux.component.html',
  styleUrl: './parametres-generaux.component.css'
})
export class ParametresGenerauxComponent implements OnInit {

  selectedParam: string = '';

  parameterItems = [
    { key: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { key: 'compte', label: 'Compte', icon: 'fas fa-user-cog' },
    { key: 'securite', label: 'Sécurité', icon: 'fas fa-lock' },
    { key: 'language', label: 'Langue', icon: 'fas fa-globe' },
  ];


  selectParameter(key: string) {
    this.selectedParam = key;
  }
    ngOnInit(): void {

    }

}
