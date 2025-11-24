import { Injectable } from '@angular/core';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

@Injectable({
  providedIn: 'root'
})
export class CrearAvatarService {

  constructor() {}

  generarAvatar(seed: string): string {
    const svg = createAvatar(lorelei, {
      seed: seed,
      
    }).toString();

    return svg;
  }
}
