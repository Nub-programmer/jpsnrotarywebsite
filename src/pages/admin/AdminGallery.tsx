import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Upload, FolderPlus, X } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { GalleryAlbum, GalleryImage } from '../../types';
import { sampleGalleryAlbums, sampleGalleryImages } from '../../lib/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminGallery: React.FC = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(sampleGalleryAlbums);
  const [images, setImages] = useState<GalleryImage[]>(sampleGalleryImages);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(sampleGalleryAlbums[0]?.id || 'all');

  // Album Modal State
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [albumPublic, setAlbumPublic] = useState(true);

  // Image Upload Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePublic, setImagePublic] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const { data: albumsData } = await supabase.from('gallery_albums').select('*').order('created_at', { ascending: false });
      const { data: imagesData } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });

      if (albumsData && albumsData.length > 0) setAlbums(albumsData);
      if (imagesData && imagesData.length > 0) setImages(imagesData);
    } catch (err) {
      console.warn("Using sample gallery fallback", err);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: albumTitle.trim(),
      description: albumDesc.trim(),
      is_public: albumPublic,
      cover_image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString()
    };

    const { isConfigured } = getSupabaseCredentials();
    try {
      const newAlbum: GalleryAlbum = { id: `album-${Date.now()}`, ...payload };
      if (isConfigured) {
        const { data } = await supabase.from('gallery_albums').insert([payload]).select('*').single();
        if (data) newAlbum.id = data.id;
      }

      setAlbums([newAlbum, ...albums]);
      setSelectedAlbumId(newAlbum.id);
      setIsAlbumModalOpen(false);
      setAlbumTitle('');
      setAlbumDesc('');
      setToast({ id: Date.now().toString(), type: 'success', title: 'Album Created', message: 'New gallery album added.' });
    } catch (err: any) {
      setToast({ id: Date.now().toString(), type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { isConfigured } = getSupabaseCredentials();

    if (isConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('gallery-images').upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          setImageUrl(publicUrlData.publicUrl);
          setToast({ id: Date.now().toString(), type: 'success', title: 'Image Uploaded', message: 'Uploaded to gallery-images bucket.' });
        }
      } catch (err) {
        setImageUrl(URL.createObjectURL(file));
      } finally {
        setIsUploading(false);
      }
    } else {
      setImageUrl(URL.createObjectURL(file));
      setIsUploading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    const payload = {
      album_id: selectedAlbumId,
      image_url: imageUrl,
      caption: caption.trim(),
      is_public: imagePublic,
      created_at: new Date().toISOString()
    };

    const { isConfigured } = getSupabaseCredentials();
    try {
      const newImg: GalleryImage = { id: `img-${Date.now()}`, ...payload };
      if (isConfigured) {
        const { data } = await supabase.from('gallery_images').insert([payload]).select('*').single();
        if (data) newImg.id = data.id;
      }

      setImages([newImg, ...images]);
      setIsImageModalOpen(false);
      setImageUrl('');
      setCaption('');
      setToast({ id: Date.now().toString(), type: 'success', title: 'Photo Added', message: 'Image added to gallery.' });
    } catch (err: any) {
      setToast({ id: Date.now().toString(), type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    const { isConfigured } = getSupabaseCredentials();
    if (isConfigured) {
      try {
        await supabase.from('gallery_images').delete().eq('id', deleteTargetId);
      } catch (e) {}
    }

    setImages(images.filter((img) => img.id !== deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
    setToast({ id: Date.now().toString(), type: 'success', title: 'Image Deleted', message: 'Photo deleted successfully.' });
  };

  const displayedImages = images.filter((img) => selectedAlbumId === 'all' || img.album_id === selectedAlbumId);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-600" /> Gallery Albums & Photos Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize activity albums, upload photos to gallery-images bucket, and set visibility.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAlbumModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" /> Create Album
          </button>
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Upload Photo
          </button>
        </div>
      </div>

      {/* Album Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setSelectedAlbumId(album.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
              selectedAlbumId === album.id ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {album.title}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayedImages.map((img) => (
          <div key={img.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group relative">
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setDeleteTargetId(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {img.caption && <div className="p-2 text-[11px] text-slate-700 truncate font-medium">{img.caption}</div>}
          </div>
        ))}
      </div>

      {/* Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Create New Gallery Album</h3>
            <form onSubmit={handleCreateAlbum} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Album Title *</label>
                <input type="text" required value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea rows={2} value={albumDesc} onChange={(e) => setAlbumDesc(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAlbumModalOpen(false)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-blue-800 text-white rounded-lg">Create Album</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Upload Image to Gallery</h3>
            <form onSubmit={handleAddImage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Album</label>
                <select value={selectedAlbumId} onChange={(e) => setSelectedAlbumId(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg">
                  {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL or Upload File</label>
                <div className="flex gap-2">
                  <input type="url" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 px-3 py-2 text-xs border rounded-lg" />
                  <label className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer shrink-0">
                    {isUploading ? 'Uploading...' : 'Browse File'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Caption</label>
                <input type="text" placeholder="Caption describing photo..." value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsImageModalOpen(false)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-blue-800 text-white rounded-lg">Save Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Photo?"
        message="Are you sure you want to remove this image from the gallery?"
        confirmLabel="Delete Photo"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteImage}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
