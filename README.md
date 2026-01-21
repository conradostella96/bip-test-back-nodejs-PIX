# 🚀 Desafio Técnico Sênior – Backend PIX (Node.js)

## ⚠️ IMPORTANTE – LEIA ANTES DE COMEÇAR
Este desafio **DEVE** ser realizado a partir do **TEMPLATE deste repositório**.

❌ **NÃO FAÇA FORK**
- Forks **não serão avaliados**
- Crie um **novo repositório a partir do template**
- Cada candidato deve possuir **repositório próprio**

---

## 🧠 Contexto de Negócio

Você faz parte de um time responsável por um **orquestrador de serviços PIX** de uma instituição financeira.

O serviço consome **dados públicos do Banco Central do Brasil** para:
- Consultar participantes PIX
- Validar ISPB
- Apoiar decisões de negócio

Recentemente, um **incidente intermitente em produção** foi reportado:
- ISPBs válidos retornam **404**
- O erro **não acontece sempre**
- Logs são inconclusivos

Sua missão é **investigar, corrigir e evoluir o serviço**.

---

## 🎯 Objetivo do Desafio

Avaliar:
- Capacidade de diagnóstico
- Conhecimento do produto PIX
- Arquitetura e qualidade de código
- Testes automatizados
- Resiliência e boas práticas

---

## 🧱 Stack Base
- Node.js 18+
- TypeScript
- Express
- Jest
- Docker / Docker Compose

---

## 🔌 Fonte de Dados (PÚBLICA)

Dados públicos do PIX:
https://www.bcb.gov.br/estabilidadefinanceira/mais-com-pix

⚠️ Não há autenticação, SLA ou contrato estável.

---

## 🐞 Endpoint com BUG proposital

```
GET /pix/participants/:ispb
```

### Problema observado
- Retorna 404 para ISPBs válidos
- Comportamento intermitente

⚠️ **O bug NÃO está documentado**
Você deve descobrir a causa.

---

## 🧪 O que esperamos do candidato

### Obrigatório
1. Diagnóstico claro do problema
2. Correção do bug
3. Testes unitários e de integração
4. Explicação técnica das decisões
5. Código limpo e organizado

### Diferenciais
- Cache com TTL
- Retry / timeout
- Circuit breaker
- Logs estruturados
- OpenAPI / Swagger

---

## ▶️ Como executar o projeto

```bash
docker-compose up --build
```

A aplicação ficará disponível em:
```
http://localhost:3000
```

---

## 📦 Entrega

- Repositório próprio criado via TEMPLATE
- README atualizado com:
  - Diagnóstico
  - Solução
  - Decisões técnicas

---

Boa sorte 🚀

---

## Diagnóstico

A API disponibilizada por default no arquivo .env "https://www.bcb.gov.br/api/pix/participants", não está disponível para utilização, retornando sempre uma tela de erro. Realizei algumas buscas e encontrei uma API que acredito ser equivalente para o propósito da tarefa. Como não consegui uma resposta válida da API original, não consegui encontrar a causa do bug do exemplo. Utilizando a API que encontrei, o resultado sempre retornou o esperado.

## Solução

Com o intúito de mitigar possíveis erros, um tratamento de entrada foi adicionado para o parâmetro ":ispb" na rota "/pix/participants/:ispb", validando para uma string contendo somente números com tamanho de 8 caracteres. Para resultados acertívos, foi utilizado Redis como cache para armazenar esse resultado da busca do ISPB por 1 dia, casos de erro ou não encontrados não são armazenados.

## Decisões técnicas

Para maior facilidade de entender o código, separei os arquivos em uma estrutura contendo "handlers", que são responsáveis pelos tratamentos de forma genérica no sistema. A "lib", contém os serviços terceiros utilizados, como o cache. Na pasta "services", estão os serviços relacionados a funcionalidade do sistema. O arquivo index.js ficou responsável pela inicialização e definição de rotas da aplicação.

## North Star

Deixo essa seção como sugestão para futuras melhorias:
  - Criação de arquivo de configuração e rotas separado, se a aplicação crescer, pode ser interessante desacoplar essas funcionalidades do arquivo index.js
  - Transcrever o código em TypeScript, traria vários benefícios, como por exemplo, prevenção de erros antecipadamente e maior facilidade de trabalho em equipe.