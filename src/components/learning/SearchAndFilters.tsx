
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface SearchFilters {
  query: string;
  tags: string[];
  step: string;
  dateRange: DateRange | undefined;
  sortBy: 'newest' | 'oldest' | 'step' | 'reviews';
}

interface SearchAndFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
  totalResults: number;
}

const SearchAndFilters = ({
  filters,
  onFiltersChange,
  availableTags,
  totalResults
}: SearchAndFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      tags: [],
      step: '',
      dateRange: undefined,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.query || filters.tags.length > 0 || filters.step || 
                          filters.dateRange || filters.sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar aprendizados..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
              ativo
            </Badge>
          )}
        </Button>
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">Filtros</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableTags.slice(0, 8).map(tag => (
                  <label key={tag} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilters({ tags: [...filters.tags, tag] });
                        } else {
                          updateFilters({ tags: filters.tags.filter(t => t !== tag) });
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="truncate">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por nível/step */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nível de Revisão
              </label>
              <Select value={filters.step} onValueChange={(value) => updateFilters({ step: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os níveis</SelectItem>
                  <SelectItem value="0">Novo (0)</SelectItem>
                  <SelectItem value="1">1 dia</SelectItem>
                  <SelectItem value="2">3 dias</SelectItem>
                  <SelectItem value="3">1 semana</SelectItem>
                  <SelectItem value="4">2 semanas</SelectItem>
                  <SelectItem value="5">1 mês</SelectItem>
                  <SelectItem value="6">2+ meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por data */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Data de Criação
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      "Selecionar período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => updateFilters({ dateRange: range })}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Ordenação */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ordenar por
              </label>
              <Select value={filters.sortBy} onValueChange={(value: any) => updateFilters({ sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recente</SelectItem>
                  <SelectItem value="oldest">Mais antigo</SelectItem>
                  <SelectItem value="step">Nível de revisão</SelectItem>
                  <SelectItem value="reviews">Mais revisado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags selecionadas */}
          {filters.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => updateFilters({ tags: filters.tags.filter(t => t !== tag) })}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Contador de resultados */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {totalResults} aprendizado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
        {hasActiveFilters && ' (filtrado)'}
      </div>
    </div>
  );
};

export default SearchAndFilters;
