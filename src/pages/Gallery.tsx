import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Folder, Maximize2, Sparkles } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../lib/supabase';
import { GalleryAlbum, GalleryImage } from '../types';
import { sampleGalleryAlbums, sampleGalleryImages } from '../lib/mockData';
import { Lightbox } from '../components/ui/Lightbox';

export const Gallery: React.FC = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(sampleGalleryAlbums);
  const [images, setImages] = useState<GalleryImage[]>(sampleGalleryImages);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      const { isConfigured } = getSupabaseCredentials();
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: albumsData } = await supabase
          .from('gallery_albums')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        const { data: imagesData } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (albumsData && albumsData.length > 0) setAlbums(albumsData);
        if (imagesData && imagesData.length > 0) setImages(imagesData);
      } catch (err) {
        console.warn("Using sample gallery fallback", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const displayedImages = selectedAlbumId === 'all'
    ? images
    : images.filter((img) => img.album_id === selectedAlbumId);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Visual Record
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Club Photo Gallery
        </h1>
        <p className="text-sm text-slate-600">
          Memorable moments, volunteer action, donation handovers, and plantation drives captured in photos.
        </p>
      </div>

      {/* Album Filter Selector */}
      {albums.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedAlbumId('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition border ${
              selectedAlbumId === 'all'
                ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Photos ({images.length})
          </button>
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbumId(album.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                selectedAlbumId === album.id
                  ? 'bg-blue-800 text-white border-blue-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Folder className="w-3.5 h-3.5" /> {album.title}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Image Grid */}
      {displayedImages.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="font-semibold text-sm">Gallery updates will appear here soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayedImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer relative"
            >
              <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
                <img
                  src={img.image_url}
                  alt={img.caption || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="p-2 bg-white/90 text-slate-900 rounded-full shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {img.caption && (
                <div className="p-3 text-xs text-slate-700 font-medium bg-white border-t border-slate-100">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        images={displayedImages}
        currentIndex={activeImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIndex) => setActiveImageIndex(newIndex)}
      />
    </div>
  );
};
