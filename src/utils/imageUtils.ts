/**
 * Image processing utilities for product registration
 * Compresses images client-side before storing into Firestore database & localStorage.
 */
import { ProductBottleImage } from '../assets/images';

export interface ImagePreset {
  id: string;
  name: string;
  description: string;
  url: string;
  tag: string;
}

export const BOTANICAL_IMAGE_PRESETS: ImagePreset[] = [
  {
    id: 'preset-classic-mira',
    name: 'Mira Signature Bottle (100ml)',
    description: 'Original amber herbal hair oil bottle with gold cap and green label',
    url: ProductBottleImage,
    tag: 'Classic'
  },
  {
    id: 'preset-rosemary-elixir',
    name: 'Rosemary & Bhringraj Elixir',
    description: 'Amber dropper bottle with natural botanical herbs infusion',
    url: 'https://images.unsplash.com/photo-1608248597359-009772c7247a?auto=format&fit=crop&w=800&q=80',
    tag: 'Rosemary'
  },
  {
    id: 'preset-amla-vitalizer',
    name: 'Amla & Neem Scalp Vitalizer',
    description: 'Pure cold-pressed Ayurvedic herbal blend in glass bottle',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    tag: 'Amla'
  },
  {
    id: 'preset-coconut-hibiscus',
    name: 'Hibiscus & Coconut Infusion',
    description: 'Minimalist natural hair oil bottle with dried botanicals',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    tag: 'Hibiscus'
  },
  {
    id: 'preset-family-pack',
    name: 'Family Value Pack (200ml)',
    description: 'Large amber dispenser bottle for long-term daily hair care',
    url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
    tag: 'Value Pack'
  },
  {
    id: 'preset-ayurvedic-kitchen',
    name: 'Traditional Herbal Extract',
    description: 'Handmade slow-cooked Ayurvedic botanical oil preparation',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    tag: 'Traditional'
  }
];

/**
 * Compresses an image file client-side into a lightweight WebP or JPEG Data URL
 * Max dimensions: 800px × 800px.
 * Quality: 0.82
 * Typical output file size: 40KB - 85KB, perfectly fitting Firestore (< 1MB document limit).
 */
export async function compressImageFile(
  file: File,
  maxDimension = 800,
  quality = 0.82
): Promise<{ dataUrl: string; sizeKb: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (JPEG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions maintaining aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize canvas context for compression.'));
          return;
        }

        // Draw and compress
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          sizeKb,
          width,
          height
        });
      };

      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file from disk.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if an image URL can be loaded successfully
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:image/')) return true;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    // Timeout after 5s
    setTimeout(() => resolve(false), 5000);
  });
}
