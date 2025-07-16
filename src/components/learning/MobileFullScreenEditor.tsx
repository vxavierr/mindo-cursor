import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LearningEntry } from '@/utils/learningStatus';

interface MobileFullScreenEditorProps {
  isOpen: boolean;
  entry: LearningEntry;
  onClose: () => void;
  onSave: (data: { title: string; content: string; tags: string[] }) => Promise<boolean>;
}

const MobileFullScreenEditor: React.FC<MobileFullScreenEditorProps> = ({
  isOpen,
  entry,
  onClose,
  onSave
}) => {
  const [editData, setEditData] = useState({
    title: entry.title,
    content: entry.content,
    tags: [...entry.tags]
  });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditData({
        title: entry.title,
        content: entry.content,
        tags: [...entry.tags]
      });
    }
  }, [isOpen, entry]);

  const handleSave = async () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(editData);
      if (success) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim()) && editData.tags.length < 5) {
      setEditData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-purple-800 to-black"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-purple-700/30 to-black/90" />
          
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              <h1 className="text-xl font-bold text-white">Editar Aprendizado</h1>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!editData.title.trim() || !editData.content.trim() || isSaving}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  editData.title.trim() && editData.content.trim() && !isSaving
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-white/5 border border-white/10 text-white/50'
                }`}
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-white font-medium mb-3 text-sm">Título</label>
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-semibold bg-white/10 text-white border-white/20 focus:border-white/40 h-14"
                  placeholder="Título do aprendizado"
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-white font-medium mb-3 text-sm">Conteúdo</label>
                <Textarea
                  value={editData.content}
                  onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                  className="text-white bg-white/10 border-white/20 focus:border-white/40 min-h-[200px] resize-none"
                  placeholder="Conteúdo do aprendizado"
                />
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-white font-medium mb-3 text-sm">Tags</label>
                
                {/* Current Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {editData.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full border border-white/20"
                      >
                        <span className="text-white/80 text-sm font-medium">{tag}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeTag(tag)}
                          className="text-white/60 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Tag */}
                <div className="flex space-x-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/10 h-12"
                    placeholder="Adicionar tag..."
                    maxLength={20}
                  />
                  <Button
                    onClick={addTag}
                    disabled={!newTag.trim() || editData.tags.length >= 5}
                    className="px-4 h-12 bg-purple-500/20 border border-purple-500/30 text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/30"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                <p className="text-white/60 text-sm mt-3">
                  {editData.tags.length}/5 tags • Pressione Enter ou clique + para adicionar
                </p>
              </motion.div>
            </div>

            {/* Bottom Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 border-t border-white/10 bg-gradient-to-t from-black/80 to-transparent"
            >
              <div className="flex space-x-4">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 h-14 text-white/70 hover:text-white transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!editData.title.trim() || !editData.content.trim() || isSaving}
                  className={`flex-1 relative group h-14 font-semibold ${
                    editData.title.trim() && editData.content.trim() && !isSaving
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </div>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFullScreenEditor;