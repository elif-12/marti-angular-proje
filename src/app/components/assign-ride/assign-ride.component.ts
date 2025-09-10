import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistanceService } from '../../services/distance.service';

declare const google: any;

@Component({
  selector: 'app-assign-ride',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-ride.component.html',
  styleUrls: ['./assign-ride.component.css']
})
export class AssignRideComponent implements AfterViewInit {
  @ViewChild('mapRef') mapRef!: ElementRef<HTMLDivElement>;

  // Form alanları
  surucu = '';
  baslangic = '';
  varis = '';
  mesafeKm: number | null = null;
  ucret = 0;
  isLoading = false;
  hata = '';

  // Harita nesneleri
  private map!: any;
  private directionsService!: any;
  private directionsRenderer!: any;
  private debounceTimer: any;

  // Demo şoför listesi
  suruculer = [
    { ad: 'Ahmet', dolu: false },
    { ad: 'Mehmet', dolu: true },
    { ad: 'Ayşe', dolu: false }
  ];

  constructor(private distance: DistanceService) {}

  // Haritayı yükle
  ngAfterViewInit(): void {
    if (!(window as any).google?.maps) {
      console.warn('Google Maps JS yüklenemedi. index.html script satırını kontrol edin.');
      return;
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: { lat: 41.015137, lng: 28.97953 }, // İstanbul
      zoom: 11,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    });
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: false,
      preserveViewport: false
    });
  }

  // Adres alanları değiştikçe otomatik km hesapla + rotayı çiz (700ms debounce)
  onAdresDegisti() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.otoMesafeHesapla(), 700);
  }

  private rotaCiz(origin: string, destination: string) {
    if (!this.directionsService) return;
    this.directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result: any, status: string) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(result);
          // Görünümü rotaya göre ayarla
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach((leg: any) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          this.map.fitBounds(bounds);
        } else {
          this.hata = 'Rota çizilemedi: ' + status;
        }
      }
    );
  }

  async otoMesafeHesapla() {
    this.hata = '';
    if (!this.baslangic || !this.varis) return;

    try {
      this.isLoading = true;

      // 1) KM (Distance Matrix)
      const km = await this.distance.hesaplaMesafe(this.baslangic, this.varis);
      this.mesafeKm = Number(km.toFixed(2));
      this.ucret = this.mesafeKm * 30;

      // 2) Haritada rotayı çiz (Directions)
      this.rotaCiz(this.baslangic, this.varis);
    } catch (e: any) {
      this.mesafeKm = null;
      this.ucret = 0;
      this.hata = typeof e === 'string' ? e : (e?.message || 'Mesafe hesaplanamadı.');
    } finally {
      this.isLoading = false;
    }
  }

  async hesaplaUcret() {
    await this.otoMesafeHesapla();
  }

  araciCagir() {
    alert(`Araç çağrıldı!\nŞoför: ${this.surucu}\nMesafe: ${this.mesafeKm ?? 0} km\nÜcret: ${this.ucret} ₺`);
  }
}
