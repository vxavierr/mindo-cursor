import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Tag, Calendar, MoreVertical, Edit2, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import EditableTags from '@/components/ui/EditableTags';

interface LearningEntry {
  id: string;
  title: string;
  content: string;
  context?: string;
  tags: string[];
  createdAt: string;
  step: number;
  reviews?: Array<{ date: string }>;
}

interface LearningCardProps {
  entry: LearningEntry;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<LearningEntry>) => Promise<boolean>;
  variant: 'clean' | 'default' | 'enhanced';
  compact?: boolean;
  desktopLayout?: boolean;
}

// Utilitário: Gradientes para o card enhanced
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
];

// Componente principal de card de aprendizado
const LearningCard: React.FC<LearningCardProps> = ({ entry, onDelete, onUpdate, variant, compact, desktopLayout }) => {
  // Estado para controlar o modal de confirmação de lixeira (compartilhado por todos os estilos)
  const [showConfirm, setShowConfirm] = React.useState(false);
  
  // Estados para controlar edição inline
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    title: entry.title,
    content: entry.content,
    tags: [...entry.tags]
  });

  // Formata a data para o padrão brasileiro
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  
  // Seleciona o gradiente de fundo baseado no hash do ID
  const cardGradient = gradients[entry.id.charCodeAt(0) % gradients.length];

  // Handlers para as ações
  const handleDelete = () => {
    onDelete && onDelete(entry.id);
    setShowConfirm(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditData({
      title: entry.title,
      content: entry.content,
      tags: [...entry.tags]
    });
  };

  const handleSaveEdit = async () => {
    if (onUpdate) {
      const success = await onUpdate(entry.id, editData);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: entry.title,
      content: entry.content,
      tags: [...entry.tags]
    });
  };

  const handleUpdate = () => {
    onUpdate && onUpdate(entry.id, entry);
  };

  // Garante que as tags sempre sejam um array, mesmo que venham como string
  const tags = Array.isArray(entry.tags)
    ? entry.tags
    : (typeof entry.tags === 'string' && entry.tags)
      ? (entry.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : [];

  // --- Layout Clean ---
  // Card minimalista, fundo branco
  if (variant === 'clean') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
        {/* Header com ID e data */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 font-medium">{formatDate(entry.createdAt)}</span>
          </div>
          
          {/* Botões de ação */}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStartEdit}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">Enviar para lixeira</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enviar para lixeira?</AlertDialogTitle>
                <AlertDialogDescription>
                  Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                  Enviar para lixeira
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* Título */}
        {isEditing ? (
          <Input
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="text-lg font-semibold text-gray-900 mb-3 border-2 border-gray-200 focus:border-blue-500"
            placeholder="Título do aprendizado"
          />
        ) : (
          entry.title && <h4 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">{entry.title}</h4>
        )}
        
        {/* Conteúdo principal */}
        {isEditing ? (
          <Textarea
            value={editData.content}
            onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
            className="text-gray-700 leading-relaxed mb-4 text-base border-2 border-gray-200 focus:border-blue-500 min-h-[120px]"
            placeholder="Conteúdo do aprendizado"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed mb-4 text-base" dangerouslySetInnerHTML={{ __html: entry.content }} />
        )}
        
        {/* Tags */}
        {isEditing ? (
          <EditableTags
            tags={editData.tags}
            onTagsChange={(newTags) => setEditData(prev => ({ ...prev, tags: newTags }))}
            isEditing={true}
          />
        ) : (
          tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">{tag}</span>
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  // --- Layout Enhanced ---
  // Card colorido, com gradiente e menu de ações
  if (variant === 'enhanced') {
    return (
      <div className="relative rounded-3xl p-4 group transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl min-h-[150px] flex flex-col" style={{ background: cardGradient, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)' }}>
        {/* Header com ID, data e menu de ações */}
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
            <span className="text-base font-bold text-gray-900">{formatDate(entry.createdAt)}</span>
          </div>
          
          {/* Botões de ação */}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 bg-white/90 border-white/20 hover:bg-white rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/80 hover:text-white hover:bg-white/20 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStartEdit}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">Enviar para lixeira</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enviar para lixeira?</AlertDialogTitle>
                <AlertDialogDescription>
                  Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                  Enviar para lixeira
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* Título */}
        {isEditing ? (
          <Input
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="text-xl font-semibold mb-4 bg-white/95 text-gray-900 border-0 focus:ring-2 focus:ring-white/50"
            placeholder="Título do aprendizado"
          />
        ) : (
          entry.title && <h3 className="text-xl font-semibold mb-4 leading-tight text-white drop-shadow-sm break-words">{entry.title}</h3>
        )}
        
        {/* Conteúdo principal */}
        <div className="flex-1 mb-4">
          {isEditing ? (
            <Textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="text-base bg-white/95 text-gray-900 border-0 focus:ring-2 focus:ring-white/50 min-h-[120px] resize-none"
              placeholder="Conteúdo do aprendizado"
            />
          ) : (
            <p className="text-white/95 leading-relaxed text-base break-words" dangerouslySetInnerHTML={{ __html: entry.content }} />
          )}
        </div>
        
        {/* Tags */}
        {isEditing ? (
          <EditableTags
            tags={editData.tags}
            onTagsChange={(newTags) => setEditData(prev => ({ ...prev, tags: newTags }))}
            isEditing={true}
          />
        ) : (
          tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium border border-white/30">{tag}</span>
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  // --- Layout Default ---
  // Card branco tradicional
  return (
    <Card className="p-6 border border-gray-100 bg-white hover:border-gray-200 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{formatDate(entry.createdAt)}</span>
        </div>
        
        {/* Botões de ação */}
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStartEdit}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">Enviar para lixeira</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enviar para lixeira?</AlertDialogTitle>
              <AlertDialogDescription>
                Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                Enviar para lixeira
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {/* Título */}
      {isEditing ? (
        <Input
          value={editData.title}
          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
          className="text-lg font-semibold text-gray-900 mb-3 border-2 border-gray-200 focus:border-blue-500"
          placeholder="Título do aprendizado"
        />
      ) : (
        entry.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{entry.title}</h3>
      )}
      
      {/* Conteúdo principal */}
      {isEditing ? (
        <Textarea
          value={editData.content}
          onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
          className="text-gray-700 leading-relaxed mb-4 border-2 border-gray-200 focus:border-blue-500 min-h-[120px]"
          placeholder="Conteúdo do aprendizado"
        />
      ) : (
        <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: entry.content }} />
      )}
      
      {/* Tags */}
      {isEditing ? (
        <EditableTags
          tags={editData.tags}
          onTagsChange={(newTags) => setEditData(prev => ({ ...prev, tags: newTags }))}
          isEditing={true}
        />
      ) : (
        tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )
      )}
    </Card>
  );
};

export default LearningCard; 