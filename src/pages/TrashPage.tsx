import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface TrashEntry {
  id_lixeira: string;
  conteudo: string;
  titulo: string;
  tags: string[];
  data_criacao: string;
  data_exclusao: string;
  contexto?: string;
  step: number;
  revisoes: any[];
}

const TrashPage = () => {
  const [trashEntries, setTrashEntries] = useState<TrashEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'restore' | 'delete';
    id: string;
    title: string;
  } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadTrashEntries = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lixeira_aprendizados')
        .select('*')
        .order('data_exclusao', { ascending: false });

      if (error) {
        console.error('Erro ao carregar lixeira:', error);
        toast({
          title: "Erro ao carregar lixeira",
          description: "Verifique sua conexão e tente novamente",
          variant: "destructive"
        });
        return;
      }

      setTrashEntries(data || []);
    } catch (error) {
      console.error('Erro inesperado ao carregar lixeira:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente recarregar a página",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreEntry = async (id: string) => {
    if (!user?.id) return;

    try {
      setActionLoading(id);
      
      // Buscar entrada na lixeira (filtrada por usuário)
      let query = supabase
        .from('lixeira_aprendizados')
        .select('*')
        .eq('id_lixeira', id);

      // Se o usuário estiver logado, filtrar por usuário
      if (user?.id) {
        query = query.eq('usuario_id', user.id);
      } else {
        // Se não estiver logado, verificar se a entrada não tem usuário
        query = query.is('usuario_id', null);
      }

      const { data: trashEntry, error: fetchError } = await query.single();

      if (fetchError || !trashEntry) {
        toast({
          title: "Erro ao restaurar",
          description: "Entrada não encontrada na lixeira",
          variant: "destructive"
        });
        return;
      }

      // Restaurar para tabela principal
      const { error: insertError } = await supabase
        .from('revisoes')
        .insert([{
          titulo: trashEntry.titulo,
          conteudo: trashEntry.conteudo,
          contexto: trashEntry.contexto,
          tags: trashEntry.tags,
          step: trashEntry.step || 0,
          revisoes: trashEntry.revisoes || [],
          data_criacao: trashEntry.data_criacao,
          data_ultima_revisao: new Date().toISOString(),
          usuario_id: user.id,
          status: 'ativo',
          hora_criacao: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Erro ao restaurar:', insertError);
        toast({
          title: "Erro ao restaurar",
          description: "Não foi possível restaurar o aprendizado",
          variant: "destructive"
        });
        return;
      }

      // Remover da lixeira
      const { error: deleteError } = await supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', id);

      if (deleteError) {
        console.error('Erro ao remover da lixeira:', deleteError);
        toast({
          title: "Erro ao limpar lixeira",
          description: "Aprendizado restaurado, mas não foi removido da lixeira",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Aprendizado restaurado!",
        description: "O aprendizado foi restaurado com sucesso."
      });

      // Atualizar lista
      setTrashEntries(prev => prev.filter(entry => entry.id_lixeira !== id));
    } catch (error) {
      console.error('Erro inesperado ao restaurar:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const permanentlyDeleteEntry = async (id: string) => {
    if (!user?.id) return;

    try {
      setActionLoading(id);
      
      let deleteQuery = supabase
        .from('lixeira_aprendizados')
        .delete()
        .eq('id_lixeira', id);

      // Se o usuário estiver logado, verificar se a entrada pertence a ele
      if (user?.id) {
        deleteQuery = deleteQuery.eq('usuario_id', user.id);
      } else {
        // Se não estiver logado, verificar se a entrada não tem usuário
        deleteQuery = deleteQuery.is('usuario_id', null);
      }

      const { error } = await deleteQuery;

      if (error) {
        console.error('Erro ao excluir permanentemente:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o aprendizado",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Aprendizado excluído permanentemente",
        description: "O aprendizado foi excluído definitivamente."
      });

      // Atualizar lista
      setTrashEntries(prev => prev.filter(entry => entry.id_lixeira !== id));
    } catch (error) {
      console.error('Erro inesperado ao excluir permanentemente:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    loadTrashEntries();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#f5f5f7' }}>
        <div className="text-center space-y-4">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center animate-pulse">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-700 font-medium text-lg">Carregando lixeira...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f7', minHeight: '100vh' }}>
      {/* Header */}
      <header className="w-full py-6 flex justify-between items-center bg-white border-b border-gray-100 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Lixeira</h1>
        </div>
        
        <Button
          variant="outline"
          onClick={loadTrashEntries}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </Button>
      </header>

      {/* Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {trashEntries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lixeira vazia
              </h3>
              <p className="text-gray-600">
                Não há aprendizados excluídos no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {trashEntries.length} {trashEntries.length === 1 ? 'aprendizado' : 'aprendizados'} na lixeira
              </div>
              
              {trashEntries.map((entry) => (
                <Card key={entry.id_lixeira} className="p-6 border border-gray-100 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm text-gray-500">
                          Excluído em: {formatDate(entry.data_exclusao)}
                        </span>
                        <span className="text-sm text-gray-400">
                          Criado em: {formatDate(entry.data_criacao)}
                        </span>
                      </div>
                      
                      {entry.titulo && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {entry.titulo}
                        </h3>
                      )}
                      
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {entry.conteudo}
                      </p>
                      
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmAction({
                          type: 'restore',
                          id: entry.id_lixeira,
                          title: entry.titulo || 'Sem título'
                        })}
                        disabled={actionLoading === entry.id_lixeira}
                        className="flex items-center space-x-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restaurar</span>
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmAction({
                          type: 'delete',
                          id: entry.id_lixeira,
                          title: entry.titulo || 'Sem título'
                        })}
                        disabled={actionLoading === entry.id_lixeira}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === 'restore' ? 'Restaurar aprendizado?' : 'Excluir permanentemente?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === 'restore' 
                ? `O aprendizado "${confirmAction.title}" será restaurado para a lista principal.`
                : `O aprendizado "${confirmAction.title}" será excluído permanentemente e não poderá ser recuperado.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction?.type === 'restore') {
                  restoreEntry(confirmAction.id);
                } else if (confirmAction?.type === 'delete') {
                  permanentlyDeleteEntry(confirmAction.id);
                }
              }}
              className={confirmAction?.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {confirmAction?.type === 'restore' ? 'Restaurar' : 'Excluir permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TrashPage; 