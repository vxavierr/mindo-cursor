import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Tag, Calendar, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface LearningEntry {
  id: string;
  numeroId: number;
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
  onUpdate?: (id: string, data: Partial<LearningEntry>) => void;
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

  // Formata o número do card com zeros à esquerda
  const formatId = (numeroId: number) => String(numeroId).padStart(4, '0');
  // Formata a data para o padrão brasileiro
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  // Seleciona o gradiente de fundo baseado no número do card
  const cardGradient = gradients[entry.numeroId % gradients.length];

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
            <span className="text-sm font-mono font-medium text-gray-600">{formatId(entry.numeroId)}</span>
            <span className="text-sm text-gray-500 font-medium">{formatDate(entry.createdAt)}</span>
          </div>
          {/* Menu de três pontinhos com opções Editar e Enviar para lixeira */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdate && onUpdate(entry.id, entry)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">Enviar para lixeira</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => { onDelete && onDelete(entry.id); setShowConfirm(false); }}>
                  Enviar para lixeira
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {/* Título */}
        {entry.title && <h4 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">{entry.title}</h4>}
        {/* Conteúdo principal */}
        <p className="text-gray-700 leading-relaxed mb-4 text-base" dangerouslySetInnerHTML={{ __html: entry.content }} />
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium border border-white/30 mr-2">{tag}</span>
            ))}
          </div>
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
            <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">#{formatId(entry.numeroId)}</span>
            <span className="text-base font-bold text-gray-900">{formatDate(entry.createdAt)}</span>
          </div>
          {/* Menu de três pontinhos com opções Editar e Enviar para lixeira */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdate && onUpdate(entry.id, entry)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">Enviar para lixeira</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => { onDelete && onDelete(entry.id); setShowConfirm(false); }}>
                  Enviar para lixeira
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {/* Título */}
        {entry.title && <h3 className="text-xl font-semibold mb-4 leading-tight text-white drop-shadow-sm break-words">{entry.title}</h3>}
        {/* Conteúdo principal */}
        <div className="flex-1 mb-4">
          <p className="text-white/95 leading-relaxed text-base break-words" dangerouslySetInnerHTML={{ __html: entry.content }} />
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium border border-white/30 mr-2">{tag}</span>
            ))}
          </div>
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
          <span className="text-sm font-mono text-gray-400">#{formatId(entry.numeroId)}</span>
          <span className="text-sm text-gray-500">{formatDate(entry.createdAt)}</span>
        </div>
        {/* Menu de três pontinhos com opções Editar e Enviar para lixeira */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 h-8 w-8 p-0 rounded-full flex items-center justify-center">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdate && onUpdate(entry.id, entry)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">Enviar para lixeira</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => { onDelete && onDelete(entry.id); setShowConfirm(false); }}>
                Enviar para lixeira
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {/* Título */}
      {entry.title && <h3 className="text-lg font-medium text-gray-900 mb-2">{entry.title}</h3>}
      {/* Conteúdo principal */}
      <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: entry.content }} />
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span key={index} className="px-3 py-1.5 bg-white/20 text-white rounded-full text-sm font-medium border border-white/30 mr-2">{tag}</span>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LearningCard; 