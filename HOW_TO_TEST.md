# 🧪 Como Executar os Testes Manuais - SpaceLearn

## 🚀 **Pré-requisitos**

1. **Aplicação rodando**: Certifique-se que o servidor está rodando em `http://localhost:8082`
2. **Usuário autenticado**: Faça login ou crie uma conta
3. **Navegador com DevTools**: Chrome, Firefox ou Edge
4. **Conexão com banco**: Verifique se Supabase está configurado

---

## 📋 **Sequência de Testes Recomendada**

### 1. **Teste de Criação de Aprendizado** ⭐ PRIORITÁRIO
```bash
# Acesse: http://localhost:8082

# Passos:
1. Clique no botão "+" (FAB) na navegação
2. Preencha o formulário:
   - Título: "Teste Manual de Criação"
   - Conteúdo: "Este é um teste de criação de aprendizado"
   - Tags: "teste", "manual", "criação"
3. Clique em "Adicionar Aprendizado"
4. Verifique se apareceu na lista da Home

# Resultado esperado:
✅ Aprendizado criado e visível na lista
✅ Toast de sucesso exibido
✅ Modal fechado automaticamente
```

### 2. **Teste de Edição Inline** ⭐ PRIORITÁRIO
```bash
# Pré-requisito: Ter pelo menos 1 aprendizado criado

# Passos:
1. Clique nos 3 pontos (...) no card
2. Selecione "Editar"
3. Modifique o título: "Teste Manual - EDITADO"
4. Modifique o conteúdo: "Conteúdo editado com sucesso"
5. Edite as tags (clique para remover, duplo-clique para editar)
6. Clique no botão ✅ (verde) para salvar

# Resultado esperado:
✅ Campos ficam editáveis
✅ Botões ✅ e ❌ aparecem
✅ Alterações são salvas
✅ Toast de sucesso exibido
```

### 3. **Teste de Exclusão para Lixeira** ⭐ PRIORITÁRIO
```bash
# Pré-requisito: Ter pelo menos 1 aprendizado criado

# Passos:
1. Clique nos 3 pontos (...) no card
2. Selecione "Enviar para lixeira"
3. Confirme a exclusão
4. Acesse: http://localhost:8082/trash
5. Verifique se o aprendizado está na lixeira

# Resultado esperado:
✅ Modal de confirmação exibido
✅ Aprendizado some da Home
✅ Aprendizado aparece na lixeira
✅ Toast de sucesso exibido
```

### 4. **Teste de Restauração** ⭐ PRIORITÁRIO
```bash
# Pré-requisito: Ter pelo menos 1 aprendizado na lixeira

# Passos:
1. Acesse: http://localhost:8082/trash
2. Clique em "Restaurar" em um aprendizado
3. Confirme a restauração
4. Volte para: http://localhost:8082
5. Verifique se o aprendizado voltou

# Resultado esperado:
✅ Aprendizado some da lixeira
✅ Aprendizado volta para a Home
✅ Dados preservados
✅ Toast de sucesso exibido
```

### 5. **Teste de Exclusão Permanente** ⚠️ CUIDADO
```bash
# Pré-requisito: Ter pelo menos 1 aprendizado na lixeira

# Passos:
1. Acesse: http://localhost:8082/trash
2. Clique em "Excluir" em um aprendizado
3. Confirme a exclusão permanente
4. Verifique se sumiu completamente

# Resultado esperado:
✅ Aprendizado some da lixeira
✅ Não aparece mais em lugar nenhum
✅ Toast de confirmação exibido
```

### 6. **Teste de Revisão com Spaced Repetition** 📚
```bash
# Pré-requisito: Ter pelo menos 1 aprendizado criado (step = 0)

# Passos:
1. Clique no botão de revisão na navegação
2. Responda as perguntas do aprendizado
3. Escolha uma dificuldade (fácil/médio/difícil)
4. Complete a revisão
5. Verifique se o aprendizado saiu da lista de revisões

# Resultado esperado:
✅ Perguntas são exibidas
✅ Sistema aceita respostas
✅ Step é incrementado
✅ Próxima revisão agendada
```

### 7. **Teste de Funcionalidades de IA** 🤖
```bash
# Pré-requisito: Funções Supabase configuradas

# Passos para melhorar texto:
1. Crie um aprendizado com texto simples
2. Use a função de IA para melhorar
3. Verifique se o texto foi aprimorado

# Passos para gerar título/tags:
1. Crie aprendizado só com conteúdo
2. Use IA para gerar título
3. Use IA para gerar tags
4. Verifique se são relevantes

# Resultado esperado:
✅ Texto é melhorado
✅ Título é gerado automaticamente
✅ Tags são sugeridas
✅ Transcrição de áudio funciona
```

---

## 🔧 **Testes de Casos Extremos**

### Edge Cases
```bash
# Teste 1: Campos vazios
- Tente criar aprendizado sem conteúdo
- Deve mostrar erro apropriado

# Teste 2: Textos muito longos
- Insira 10.000 caracteres
- Sistema deve lidar graciosamente

# Teste 3: Muitos aprendizados
- Crie 50+ aprendizados
- Performance deve ser aceitável

# Teste 4: Conectividade
- Desconecte a internet
- Reconecte e verifique sincronização
```

---

## 🐛 **Como Reportar Bugs**

### Informações Necessárias:
1. **Passos para reproduzir** o bug
2. **Resultado esperado** vs **resultado obtido**
3. **Screenshot/video** se relevante
4. **Mensagens de erro** no console (F12)
5. **Navegador e versão**

### Formato:
```markdown
## 🐛 Bug: [Título descritivo]

**Passos para reproduzir:**
1. Passo 1
2. Passo 2
3. Passo 3

**Resultado esperado:**
Deveria fazer X

**Resultado obtido:**
Fez Y em vez de X

**Erro no console:**
```
Error: [copiar mensagem de erro]
```

**Navegador:** Chrome 120.0.0.0
**Prioridade:** Alta/Média/Baixa
```

---

## 📊 **Critérios de Aprovação**

### ✅ **Teste APROVADO se:**
- Todas as funcionalidades principais funcionam
- Não há erros críticos
- Performance é aceitável (< 3s para operações)
- UX é fluida e intuitiva
- Dados são persistidos corretamente

### ❌ **Teste REPROVADO se:**
- Qualquer funcionalidade crítica quebrada
- Há perda de dados
- Performance inaceitável (> 10s)
- UX confusa ou quebrada
- Erros críticos no console

---

## 🎯 **Checklist Final**

Marque ✅ conforme completa cada teste:

- [ ] **Criação de aprendizado** - Funciona perfeitamente
- [ ] **Edição inline** - Funciona perfeitamente
- [ ] **Exclusão para lixeira** - Funciona perfeitamente
- [ ] **Restauração** - Funciona perfeitamente
- [ ] **Exclusão permanente** - Funciona perfeitamente
- [ ] **Revisão com spaced repetition** - Funciona perfeitamente
- [ ] **Funcionalidades de IA** - Funciona perfeitamente
- [ ] **Performance** - Aceitável
- [ ] **UX** - Fluida e intuitiva
- [ ] **Sem bugs críticos** - Confirmado

### 🎉 **Status Final:**
- [ ] **TODOS OS TESTES APROVADOS** - Aplicação pronta para uso
- [ ] **ALGUNS TESTES FALHARAM** - Correções necessárias
- [ ] **MUITOS TESTES FALHARAM** - Revisão completa necessária 