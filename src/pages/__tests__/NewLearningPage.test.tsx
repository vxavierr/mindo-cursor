import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import NewLearningPage from '../NewLearningPage';

// Mock dos hooks
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => true // Simula ambiente mobile
}));

jest.mock('@/hooks/useLearning', () => ({
  useLearning: () => ({
    addLearningEntry: jest.fn(() => Promise.resolve())
  })
}));

jest.mock('@/hooks/useEnhancedAI', () => ({
  useEnhancedAI: () => ({
    improveText: jest.fn(() => Promise.resolve('Texto melhorado')),
    generateTitleAndTags: jest.fn(() => Promise.resolve({
      title: 'Título Gerado',
      tags: ['tag1', 'tag2']
    })),
    transcribeAudio: jest.fn(() => Promise.resolve('Texto transcrito'))
  })
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        {children}
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

describe('NewLearningPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message on load', async () => {
    render(
      <TestWrapper>
        <NewLearningPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Olá! 👋 Estou aqui para ajudar/)).toBeInTheDocument();
    });
  });

  test('displays page title and navigation', () => {
    render(
      <TestWrapper>
        <NewLearningPage />
      </TestWrapper>
    );

    expect(screen.getByText('Novo Aprendizado')).toBeInTheDocument();
    expect(screen.getByText('Conversando com a IA')).toBeInTheDocument();
  });

  test('allows user to type and send message', async () => {
    render(
      <TestWrapper>
        <NewLearningPage />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Digite sua mensagem ou grave um áudio...');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(textarea, { target: { value: 'Teste de mensagem' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Teste de mensagem')).toBeInTheDocument();
    });
  });

  test('shows content preview when learning content is available', async () => {
    render(
      <TestWrapper>
        <NewLearningPage />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Digite sua mensagem ou grave um áudio...');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(textarea, { target: { value: 'Aprendi sobre React hoje' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('📝 Conteúdo atual:')).toBeInTheDocument();
      expect(screen.getByText('Aprendi sobre React hoje')).toBeInTheDocument();
    });
  });

  test('prevents sending empty or very short messages', () => {
    render(
      <TestWrapper>
        <NewLearningPage />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Digite sua mensagem ou grave um áudio...');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // Teste com mensagem muito curta
    fireEvent.change(textarea, { target: { value: 'hi' } });
    fireEvent.click(sendButton);

    // A mensagem não deve aparecer
    expect(screen.queryByText('hi')).not.toBeInTheDocument();
  });

  test('displays character count in content preview', async () => {
    render(
      <TestWrapper>
        <NewLearningPage />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText('Digite sua mensagem ou grave um áudio...');
    const sendButton = screen.getByRole('button', { name: /Send/i });

    const testMessage = 'Esta é uma mensagem de teste para verificar o contador de caracteres';
    fireEvent.change(textarea, { target: { value: testMessage } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(`${testMessage.length} caracteres`)).toBeInTheDocument();
    });
  });
});