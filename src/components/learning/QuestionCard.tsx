
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface QuestionCardProps {
  questions: string[];
  questionIndex: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onCompleteReview: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const QuestionCard = ({ 
  questions, 
  questionIndex, 
  currentAnswer, 
  onAnswerChange, 
  onNextQuestion, 
  onPrevQuestion, 
  onCompleteReview 
}: QuestionCardProps) => {
  const isLastQuestion = questionIndex === questions.length - 1;
  const isFirstQuestion = questionIndex === 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Pergunta {questionIndex + 1} de {questions.length}
        </h3>
        <div className="w-20 sm:w-32 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <Card className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border border-gray-700/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
        <p className="text-sm sm:text-lg text-gray-100 break-words leading-relaxed">
          {questions[questionIndex]}
        </p>
      </Card>

      {/* Resposta */}
      <div className="space-y-3">
        <Label htmlFor="answer" className="text-gray-200 text-sm">Sua resposta:</Label>
        <div className="bg-gray-800 border border-gray-600 rounded-xl">
          <RichTextEditor
            content={currentAnswer}
            onChange={onAnswerChange}
            placeholder="Digite sua resposta aqui..."
            className="min-h-[100px] sm:min-h-[120px]"
          />
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Button 
          variant="outline" 
          onClick={onPrevQuestion}
          disabled={isFirstQuestion}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 text-sm px-3"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2 flex-wrap">
          {isLastQuestion ? (
            <>
              <Button 
                onClick={() => onCompleteReview('hard')}
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-500/20 text-xs px-2 sm:px-3"
              >
                Difícil
              </Button>
              <Button 
                onClick={() => onCompleteReview('medium')}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-500/20 text-xs px-2 sm:px-3"
              >
                Médio
              </Button>
              <Button 
                onClick={() => onCompleteReview('easy')}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 sm:px-3"
              >
                Fácil
              </Button>
            </>
          ) : (
            <Button 
              onClick={onNextQuestion}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white text-sm px-4"
            >
              Próxima
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
