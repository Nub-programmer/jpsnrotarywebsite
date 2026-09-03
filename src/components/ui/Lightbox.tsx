import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '../../types';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-8 animate-in fade-in">
      {/* Top Bar */}
      <div className="w-full max-w-6xl flex justify-between items-center text-white z-10">
        <span className="text-sm font-medium text-slate-300">
          Image {currentIndex + 1} of {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative flex-1 max-w-5xl w-full flex items-center justify-center my-4">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 p-3 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white transition z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImage?.image_url}
          alt={currentImage?.caption || 'Gallery Photo'}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
          onError={onClose}
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 p-3 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white transition z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Caption */}
      {currentImage?.caption && (
        <div className="w-full max-w-2xl text-center bg-slate-900/80 text-slate-200 text-sm px-4 py-2.5 rounded-lg border border-slate-800">
          {currentImage.caption}
        </div>
      )}
    </div>
  );
};
