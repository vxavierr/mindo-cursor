
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface EmptyReviewStateProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmptyReviewState = ({ isOpen, onClose }: EmptyReviewStateProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md border-0 bg-gray-900 text-white shadow-2xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-6 p-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Tudo em dia! 🎉
              </h2>
              <p className="text-gray-300 mb-4 text-sm">
                Você não tem revisões pendentes hoje.
              </p>
              <p className="text-xs text-gray-400">
                Continue aprendendo e volte depois para suas próximas revisões!
              </p>
            </div>
            <Button 
              onClick={onClose} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmptyReviewState;
