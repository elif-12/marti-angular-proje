import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class DistanceService {

  // Distance Matrix ile iki adres arasını km cinsinden döndürür
  hesaplaMesafe(adres1: string, adres2: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // Google Maps JS yüklenmediyse net hata verelim
      if (!(window as any).google?.maps) {
        reject('Google Maps yüklenemedi (key/script kontrol edin).');
        return;
      }

      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [adres1],
          destinations: [adres2],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        },
        (response: any, status: string) => {
          if (status === 'OK') {
            const element = response?.rows?.[0]?.elements?.[0];
            if (element?.status === 'OK') {
              const metres = element.distance.value;
              resolve(metres / 1000);
            } else {
              reject('Adres/rota bulunamadı: ' + (element?.status ?? 'UNKNOWN'));
            }
          } else {
            reject('Distance Matrix hatası: ' + status);
          }
        }
      );
    });
  }
}
