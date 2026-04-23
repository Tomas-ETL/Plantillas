import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Obligatorio para GitHub Pages
  images: {
    unoptimized: true, // GitHub Pages no soporta optimización de imágenes nativa de Next
  },
};

export default nextConfig;
