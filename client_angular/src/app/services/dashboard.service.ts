import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Equipement} from "../models/equipement";



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {
  }


  getRoleCounts(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/user/role-counts`);
  }

  getUserStatusCounts(): Observable<{ total: number; active: number; inactive: number }> {
    return this.http.get<{ total: number; active: number; inactive: number }>(`${this.apiUrl}/user/status-counts`);
  }

  getUserRegistrationsPerMonth(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/user/registrations-per-month`);
  }

  // --- EQUIPEMENT STATS ---
  getTotalEquipements(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/equipement/count`);
  }

  getEquipementsStatusCounts(): Observable<{
    total: number;
    EN_SERVICE: number;
    EN_PANNE: number;
    EN_MAINTENANCE: number;
  }> {
    return this.http.get<{
      total: number;
      EN_SERVICE: number;
      EN_PANNE: number;
      EN_MAINTENANCE: number;
    }>(`${this.apiUrl}/equipement/by-statut`);
  }


  getEquipementsByMarque(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/equipement/by-marque`);
  }

  getEquipementsByType(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/equipement/by-type`);
  }

  getEquipementsByService(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/equipement/by-service`);
  }

  getExpiredGarantiesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/equipement/expired-garantie`);
  }

  getEquipementsTotalCost(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/equipement/total-cost`);
  }

  getEquipementsWithoutRecentMaintenance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/equipement/without-recent-maintenance`);
  }

  getEquipementsAboveThreshold(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/equipement/above-threshold`);
  }


  // 🔢 Total pieces
  getTotalPieces(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/piece/count`);
  }

  getPieceStatusCounts(): Observable<{
    total: number;
    rupture: number;
    stockBas: number;
    disponible: number;
  }> {
    return this.http.get<{
      total: number;
      rupture: number;
      stockBas: number;
      disponible: number;
    }>(`${this.apiUrl}/piece/status-counts`);
  }


  // 📈 Purchases per month (yyyy-MM)
  getPurchasesPerMonth(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/piece/purchases-per-month`);
  }

  // 📊 Average quantity per purchase
  getAverageQuantity(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/piece/average-quantity`);
  }

  // 💰 Average unit cost
  getAverageUnitCost(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/piece/average-unit-cost`);
  }

  // 💸 Total purchase cost
  getTotalPurchaseCost(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/piece/total-purchase-cost`);
  }

  // 🧑‍💼 Pieces per supplier
  getPieceCountsBySupplier(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/piece/supplier-counts`);
  }



}
