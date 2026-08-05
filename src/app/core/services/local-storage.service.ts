import { Injectable } from '@angular/core';
import {LocalStorageKey} from './local-storage-key.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  get<T>(key: LocalStorageKey): T | null {
    const value = localStorage.getItem(key);
    if (value === null || value ==='') {
      return null;
    }
    return JSON.parse(value) as T;
  }

  set<T>(key: LocalStorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove<T>(key: LocalStorageKey): void {
    localStorage.removeItem(key);
  }
}
