# 🧪 Manual Testing Checklist - SpaceLearn

## 📋 **Testes de Funcionalidade Principal**

### 1. ✅ **Criação de Aprendizado**
- [ ] **Abrir modal de criação**
  - Clicar no botão "+" na navegação flutuante
  - Modal `AddLearningModal` deve abrir
  - Formulário deve estar limpo e focado

- [ ] **Preenchimento básico**
  - Inserir título: "Teste de Criação Manual"
  - Inserir conteúdo: "Este é um teste de criação de aprendizado"
  - Adicionar tags: "teste", "manual", "criação"

- [ ] **Submissão**
  - Clicar em "Adicionar Aprendizado"
  - Modal deve fechar
  - Toast de sucesso deve aparecer
  - Aprendizado deve aparecer na lista da Home

- [ ] **Validação dos dados**
  - Verificar se título aparece corretamente
  - Verificar se conteúdo aparece corretamente
  - Verificar se tags aparecem corretamente
  - Verificar se data de criação está correta

### 2. ✏️ **Edição Inline de Aprendizado**
- [ ] **Ativar modo de edição**
  - Clicar nos 3 pontos no card
  - Selecionar "Editar"
  - Campos devem ficar editáveis
  - Botões ✅ e ❌ devem aparecer

- [ ] **Editar título**
  - Modificar título para "Teste de Edição Manual - EDITADO"
  - Verificar se Input está funcionando

- [ ] **Editar conteúdo**
  - Modificar conteúdo para "Conteúdo editado com sucesso"
  - Verificar se Textarea está funcionando

- [ ] **Editar tags**
  - Clicar em uma tag existente → deve permitir edição
  - Duplo clique em uma tag → deve abrir input de edição
  - Clicar no X de uma tag → deve remover
  - Clicar no + → deve permitir adicionar nova tag

- [ ] **Salvar alterações**
  - Clicar no botão ✅ (verde)
  - Modo de edição deve sair
  - Alterações devem persistir
  - Toast de sucesso deve aparecer

- [ ] **Cancelar alterações**
  - Entrar em modo de edição novamente
  - Fazer alterações
  - Clicar no botão ❌ (cinza)
  - Alterações devem ser descartadas
  - Voltar aos valores originais

### 3. 🗑️ **Exclusão para Lixeira**
- [ ] **Iniciar exclusão**
  - Clicar nos 3 pontos no card
  - Selecionar "Enviar para lixeira"
  - Modal de confirmação deve aparecer

- [ ] **Confirmar exclusão**
  - Clicar em "Enviar para lixeira"
  - Modal deve fechar
  - Aprendizado deve sumir da Home
  - Toast de sucesso deve aparecer

- [ ] **Verificar na lixeira**
  - Navegar para página de lixeira
  - Aprendizado deve estar na lista
  - Dados devem estar preservados

### 4. 🔄 **Restauração da Lixeira**
- [ ] **Navegar para lixeira**
  - Ir para página de lixeira
  - Encontrar aprendizado excluído

- [ ] **Restaurar aprendizado**
  - Clicar em "Restaurar"
  - Confirmação deve aparecer
  - Aprendizado deve sumir da lixeira

- [ ] **Verificar na Home**
  - Voltar para Home
  - Aprendizado deve estar de volta
  - Dados devem estar preservados

### 5. 🔥 **Exclusão Permanente**
- [ ] **Excluir novamente**
  - Enviar aprendizado para lixeira novamente
  - Ir para página de lixeira

- [ ] **Exclusão definitiva**
  - Clicar em "Excluir permanentemente"
  - Confirmação deve aparecer
  - Aprendizado deve sumir completamente

- [ ] **Verificar ausência**
  - Não deve estar na Home
  - Não deve estar na lixeira
  - Deve ter sido removido do banco

### 6. 📚 **Revisão com Spaced Repetition**
- [ ] **Criar aprendizado para revisão**
  - Criar novo aprendizado
  - Verificar se step = 0 (novo)

- [ ] **Primeira revisão**
  - Ir para revisões do dia
  - Aprendizado deve aparecer na lista
  - Fazer revisão (responder perguntas)
  - Escolher dificuldade (fácil/médio/difícil)

- [ ] **Verificar progressão**
  - Step deve incrementar
  - Próxima revisão deve ser agendada
  - Aprendizado deve sair da lista de hoje

- [ ] **Agendar próxima revisão**
  - Verificar se algoritmo calculou corretamente
  - Intervalo deve aumentar baseado na dificuldade
  - Data da próxima revisão deve estar correta

### 7. 🤖 **Funcionalidades de IA**
- [ ] **Melhorar texto**
  - Criar aprendizado com texto simples
  - Usar função de IA para melhorar
  - Verificar se texto foi aprimorado

- [ ] **Gerar título automático**
  - Criar aprendizado apenas com conteúdo
  - Usar IA para gerar título
  - Verificar se título é relevante

- [ ] **Gerar tags automáticas**
  - Criar aprendizado com conteúdo
  - Usar IA para sugerir tags
  - Verificar se tags são relevantes

- [ ] **Transcrição de áudio**
  - Gravar áudio
  - Usar função de transcrição
  - Verificar se texto foi transcrito corretamente

## 🚨 **Casos de Erro e Edge Cases**

### Validação de Dados
- [ ] **Campos obrigatórios**
  - Tentar criar aprendizado sem conteúdo
  - Deve mostrar erro apropriado

- [ ] **Limites de caracteres**
  - Testar com textos muito longos
  - Sistema deve lidar graciosamente

### Conectividade
- [ ] **Offline/Online**
  - Testar com internet instável
  - Verificar se dados são salvos quando volta online

### Performance
- [ ] **Muitos aprendizados**
  - Criar 20+ aprendizados
  - Verificar se lista carrega rapidamente
  - Verificar se edição/exclusão funciona

## 📊 **Resultado dos Testes**

### ✅ Funcionalidades Testadas e Aprovadas:
- [ ] Criação de aprendizado
- [ ] Edição inline
- [ ] Exclusão para lixeira
- [ ] Restauração da lixeira
- [ ] Exclusão permanente
- [ ] Revisão com spaced repetition
- [ ] Funcionalidades de IA

### ❌ Bugs Encontrados:
- [ ] Nenhum
- [ ] [Listar bugs encontrados aqui]

### 🔧 Correções Necessárias:
- [ ] Nenhuma
- [ ] [Listar correções necessárias aqui]

---

## 🎯 **Critérios de Aprovação**

✅ **Teste aprovado se:**
- Todas as funcionalidades funcionam conforme especificado
- Não há erros críticos
- Performance é aceitável
- UX é fluida e intuitiva

❌ **Teste reprovado se:**
- Qualquer funcionalidade crítica não funciona
- Há perda de dados
- Performance é inaceitável
- UX é confusa ou quebrada 