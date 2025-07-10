import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LearningCard from '../LearningCard';
import { LearningCardLayoutProvider } from '../LearningCardLayoutContext';

// Mock dos hooks
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock do componente EditableTags
jest.mock('@/components/ui/EditableTags', () => {
  return function MockEditableTags({ tags, onTagsChange, isEditing }: any) {
    if (!isEditing) {
      return (
        <div data-testid="tags-display">
          {tags.map((tag: string, index: number) => (
            <span key={index} data-testid={`tag-${index}`}>{tag}</span>
          ))}
        </div>
      );
    }
    return (
      <div data-testid="tags-editor">
        <input
          data-testid="tags-input"
          value={tags.join(', ')}
          onChange={(e) => onTagsChange(e.target.value.split(', ').filter(Boolean))}
        />
      </div>
    );
  };
});

const mockEntry = {
  id: '1',
  title: 'Teste de Aprendizado',
  content: 'Conteúdo do aprendizado de teste',
  tags: ['teste', 'aprendizado'],
  createdAt: '2024-01-15T10:00:00Z',
  step: 0,
  reviews: []
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <LearningCardLayoutProvider>
      {component}
    </LearningCardLayoutProvider>
  );
};

describe('LearningCard', () => {
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnUpdate.mockResolvedValue(true);
  });

  describe('Display Mode', () => {
    it('should render entry data correctly', () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      expect(screen.getByText('Teste de Aprendizado')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo do aprendizado de teste')).toBeInTheDocument();
      expect(screen.getByText('teste')).toBeInTheDocument();
      expect(screen.getByText('aprendizado')).toBeInTheDocument();
      expect(screen.getByText('15/01')).toBeInTheDocument(); // Data formatada
    });

    it('should show dropdown menu when clicking three dots', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      const menuButton = screen.getByRole('button');
      await user.click(menuButton);

      expect(screen.getByText('Editar')).toBeInTheDocument();
      expect(screen.getByText('Enviar para lixeira')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when clicking edit button', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Abrir menu
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);

      // Clicar em editar
      const editButton = screen.getByText('Editar');
      await user.click(editButton);

      // Verificar se entrou no modo de edição
      expect(screen.getByDisplayValue('Teste de Aprendizado')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Conteúdo do aprendizado de teste')).toBeInTheDocument();
      expect(screen.getByTestId('tags-editor')).toBeInTheDocument();
    });

    it('should have save and cancel buttons in edit mode', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Entrar no modo de edição
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      const editButton = screen.getByText('Editar');
      await user.click(editButton);

      // Verificar botões de salvar e cancelar
      expect(screen.getByRole('button', { name: /check/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
    });

    it('should save changes when clicking save button', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Entrar no modo de edição
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      const editButton = screen.getByText('Editar');
      await user.click(editButton);

      // Editar título
      const titleInput = screen.getByDisplayValue('Teste de Aprendizado');
      await user.clear(titleInput);
      await user.type(titleInput, 'Título Editado');

      // Editar conteúdo
      const contentInput = screen.getByDisplayValue('Conteúdo do aprendizado de teste');
      await user.clear(contentInput);
      await user.type(contentInput, 'Conteúdo Editado');

      // Salvar
      const saveButton = screen.getByRole('button', { name: /check/i });
      await user.click(saveButton);

      // Verificar se onUpdate foi chamado com os dados corretos
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith('1', {
          title: 'Título Editado',
          content: 'Conteúdo Editado',
          tags: ['teste', 'aprendizado']
        });
      });
    });

    it('should cancel changes when clicking cancel button', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Entrar no modo de edição
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      const editButton = screen.getByText('Editar');
      await user.click(editButton);

      // Editar título
      const titleInput = screen.getByDisplayValue('Teste de Aprendizado');
      await user.clear(titleInput);
      await user.type(titleInput, 'Título Editado');

      // Cancelar
      const cancelButton = screen.getByRole('button', { name: /x/i });
      await user.click(cancelButton);

      // Verificar se voltou ao modo de visualização com dados originais
      expect(screen.getByText('Teste de Aprendizado')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Título Editado')).not.toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should edit tags using EditableTags component', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Entrar no modo de edição
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      const editButton = screen.getByText('Editar');
      await user.click(editButton);

      // Editar tags
      const tagsInput = screen.getByTestId('tags-input');
      await user.clear(tagsInput);
      await user.type(tagsInput, 'nova, tag, editada');

      // Salvar
      const saveButton = screen.getByRole('button', { name: /check/i });
      await user.click(saveButton);

      // Verificar se onUpdate foi chamado com as tags corretas
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith('1', {
          title: 'Teste de Aprendizado',
          content: 'Conteúdo do aprendizado de teste',
          tags: ['nova', 'tag', 'editada']
        });
      });
    });
  });

  describe('Delete Mode', () => {
    it('should show confirmation dialog when clicking delete', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Abrir menu
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);

      // Clicar em excluir
      const deleteButton = screen.getByText('Enviar para lixeira');
      await user.click(deleteButton);

      // Verificar se modal de confirmação apareceu
      expect(screen.getByText('Enviar para lixeira?')).toBeInTheDocument();
      expect(screen.getByText('Este aprendizado será movido para a lixeira. Você poderá restaurá-lo a qualquer momento.')).toBeInTheDocument();
    });

    it('should call onDelete when confirming deletion', async () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      // Abrir menu e clicar em excluir
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      const deleteButton = screen.getByText('Enviar para lixeira');
      await user.click(deleteButton);

      // Confirmar exclusão
      const confirmButton = screen.getByRole('button', { name: /enviar para lixeira/i });
      await user.click(confirmButton);

      // Verificar se onDelete foi chamado
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('Different Variants', () => {
    it('should render clean variant correctly', () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="clean"
        />
      );

      expect(screen.getByText('Teste de Aprendizado')).toBeInTheDocument();
    });

    it('should render enhanced variant correctly', () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="enhanced"
        />
      );

      expect(screen.getByText('Teste de Aprendizado')).toBeInTheDocument();
    });

    it('should render default variant correctly', () => {
      renderWithProvider(
        <LearningCard
          entry={mockEntry}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          variant="default"
        />
      );

      expect(screen.getByText('Teste de Aprendizado')).toBeInTheDocument();
    });
  });
}); 