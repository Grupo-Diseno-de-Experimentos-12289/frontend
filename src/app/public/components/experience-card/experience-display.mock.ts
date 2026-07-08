// Datos de presentación (imagen, precio, rating, categoría) que el backend de Experience
// todavía no expone. Se derivan de forma determinista del id para no depender de datos falsos
// persistidos ni de endpoints inventados, y para que un mismo id muestre siempre el mismo
// precio/rating/imagen en Home, Detalle de experiencia y Favoritos.
import { Experience } from '../../../experience-detail/services/experience.service';
import { ExperienceCardData } from './experience-card';

export interface CategoryTab {
  key: string;
  label: string;
}

export const CATEGORY_TABS: CategoryTab[] = [
  { key: 'cultura', label: 'Culture' },
  { key: 'gastronomia', label: 'Food' },
  { key: 'naturaleza', label: 'Nature' },
  { key: 'deporte', label: 'Sports' }
];

// placeholder images (no hay assets de fotografía real en el proyecto)
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80'
];

export interface ExperienceDisplayData extends ExperienceCardData {
  category: string;
}

export function toDisplayData(experience: Experience, index: number): ExperienceDisplayData {
  const category = CATEGORY_TABS[index % CATEGORY_TABS.length].key;
  const image = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  const rating = Math.round((3.8 + ((experience.id * 37) % 13) / 10) * 10) / 10;
  const price = 29 + ((experience.id * 17) % 12) * 10;

  return {
    id: experience.id,
    title: experience.title,
    imageUrl: image,
    badgeLabel: 'Guided tour',
    durationLabel: '1 day · Skip the line · Pickup available',
    rating,
    priceFrom: price,
    category
  };
}

export interface BestPlace {
  rank: number;
  name: string;
  imageUrl: string;
}

export const BEST_CULTURAL_PLACES: BestPlace[] = [
  {
    rank: 1,
    name: 'Uros Islands',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80'
  },
  {
    rank: 2,
    name: 'Machu Picchu',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    rank: 3,
    name: 'Sacred Valley',
    imageUrl: 'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=1200&q=80'
  }
];
