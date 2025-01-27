import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Z-Scanner',
    short_name: 'Z-Scanner',
    start_url: '/',
    theme_color: '#965b9a',
    background_color: '#965b9a',
    icons: [
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: 'icon512_maskable.png',
        type: 'image/png',
      },
      {
        purpose: 'any',
        sizes: '512x512',
        src: 'icon512_rounded.png',
        type: 'image/png',
      },
    ],
  };
}
