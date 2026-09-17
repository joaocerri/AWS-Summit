# AWS Summit São Paulo 2026

**Data:** 03 de setembro de 2026
**Local:** São Paulo Expo — São Paulo, SP
**Evento:** AWS Summit São Paulo 2026

O AWS Summit São Paulo 2026 reuniu conteúdos relacionados a **Inteligência Artificial Agêntica, Cloud Computing, desenvolvimento de software, dados, segurança, governança, modernização de aplicações e arquitetura AWS**.

A edição contou com mais de **170 sessões**, incluindo apresentações técnicas, demonstrações, sessões de clientes, workshops e atividades práticas. Um dos principais temas do evento foi a evolução da IA Generativa para **sistemas agênticos capazes de acessar dados, utilizar ferramentas, executar tarefas e participar de processos empresariais de maneira controlada**.

---

# 1 — Da demo ao deploy: resolvendo os maiores desafios de IA agêntica

**Sessão:** AIM206
**Nível:** 200 — Intermediate
**Tema:** Amazon Bedrock AgentCore / IA Agêntica

A sessão apresentou os principais desafios envolvidos na transformação de uma **Proof of Concept (PoC)** de Inteligência Artificial em uma solução realmente preparada para produção.

Criar uma demonstração utilizando um Large Language Model (LLM) pode ser relativamente simples. Entretanto, colocar um agente em produção exige uma infraestrutura capaz de fornecer **contexto, segurança, identidade, ferramentas, observabilidade, escalabilidade e controle operacional**.

## Amazon Bedrock AgentCore

Um dos principais componentes apresentados foi o **Amazon Bedrock AgentCore**, plataforma da AWS destinada à construção, implantação, conexão e operação de agentes de IA em escala.

O AgentCore fornece componentes de infraestrutura para que agentes possam operar de maneira segura dentro de ambientes corporativos.

Entre os principais elementos relacionados ao ecossistema estão:

* Runtime para execução de agentes;
* Gateway para disponibilização e acesso a ferramentas;
* Identity para gerenciamento de identidade e autenticação;
* Memory para persistência de contexto;
* Observability para monitoramento das execuções;
* integração com ferramentas externas;
* acesso a dados e Knowledge Bases;
* Browser;
* Code Interpreter;
* Web Search.

O objetivo é permitir que o desenvolvedor concentre maior esforço na **lógica e no comportamento do agente**, enquanto a plataforma fornece parte da infraestrutura necessária para colocá-lo em produção.

---

## Dados e contexto

Um dos principais aprendizados da sessão foi que a qualidade de um agente depende diretamente da qualidade do contexto disponibilizado.

Antes que informações sejam utilizadas por uma IA, pode existir uma etapa de preparação dos dados envolvendo:

1. coleta dos dados;
2. limpeza;
3. remoção de duplicidades;
4. normalização;
5. padronização;
6. enriquecimento;
7. cruzamento entre diferentes fontes;
8. geração de metadados;
9. disponibilização das informações para recuperação pelo agente.

Um exemplo seria um agente de atendimento precisar responder sobre determinado pedido.

Isoladamente, o sistema poderia possuir apenas:

> Pedido X ficará pronto em aproximadamente Y minutos.

Entretanto, ao cruzar informações do pedido com dados do cliente, o contexto poderia incluir:

* situação atual do pedido;
* prazo previsto;
* histórico de compras;
* reclamações anteriores;
* ocorrências relacionadas;
* informações relevantes do relacionamento com o cliente.

A LLM passa então a receber um contexto significativamente mais rico para formular sua resposta.

---

## RAG — Retrieval-Augmented Generation

Outro conceito importante é o **RAG (Retrieval-Augmented Generation)**.

RAG não significa simplesmente conectar uma LLM diretamente a um banco de dados.

A ideia é permitir que o sistema **recupere informações relevantes de fontes externas no momento da solicitação e forneça essas informações como contexto para o modelo**.

Essas fontes podem incluir:

* documentos;
* bases de conhecimento;
* bancos de dados;
* sistemas empresariais;
* páginas internas;
* APIs;
* mecanismos de busca;
* dados estruturados e não estruturados.

O objetivo é reduzir a dependência exclusiva do conhecimento presente no treinamento do modelo e produzir respostas fundamentadas em informações específicas e atualizadas.

Isso pode reduzir respostas sem fundamento, embora **RAG não elimine completamente a possibilidade de alucinação**.

---

## LLM não deve executar tudo

Outro ponto importante foi entender quais atividades realmente devem ser delegadas à LLM.

LLMs são especialmente úteis para tarefas como:

* interpretação de linguagem;
* classificação;
* resumo;
* extração de informações;
* raciocínio sobre contexto;
* geração de texto;
* planejamento;
* seleção de ferramentas.

Entretanto, tarefas determinísticas ou que exigem precisão absoluta podem ser mais adequadas para execução por código tradicional.

Exemplos:

* cálculos financeiros;
* validação de regras de negócio;
* comparação de valores;
* cálculos matemáticos;
* transformação estruturada de dados;
* verificações determinísticas.

Uma arquitetura robusta pode seguir o princípio:

```text
LLM → interpreta e decide o que precisa ser feito
          ↓
Tool / código → executa a operação determinística
          ↓
LLM → interpreta o resultado e prepara a resposta
```

Dessa maneira, o modelo funciona como uma camada de **interpretação e orquestração**, enquanto operações críticas permanecem em componentes determinísticos.

---

## Metadados, rastreabilidade e observabilidade

Para ambientes corporativos, não basta que o agente produza uma resposta correta.

Também é necessário compreender:

* quais dados foram utilizados;
* quais ferramentas foram acionadas;
* quais decisões foram tomadas;
* quanto tempo cada etapa levou;
* quais erros ocorreram;
* quais fontes fundamentaram a resposta.

Por isso, observabilidade e rastreabilidade são componentes fundamentais de sistemas agênticos.

Esse monitoramento permite:

* identificar causa raiz de problemas;
* avaliar comportamento dos agentes;
* acompanhar performance;
* investigar falhas;
* analisar chamadas de ferramentas;
* medir latência;
* identificar oportunidades de melhoria.

---

## Segurança

Quanto maior a autonomia de um agente, maior precisa ser o controle sobre suas permissões.

O agente não deve possuir acesso irrestrito aos sistemas corporativos.

A arquitetura deve considerar princípios como:

* autenticação;
* autorização;
* princípio do menor privilégio;
* isolamento de ambientes;
* controle de acesso aos dados;
* auditoria;
* proteção de informações sensíveis;
* definição das ferramentas que cada agente pode utilizar.

A segurança deixa, portanto, de ser apenas uma camada externa da aplicação e passa a fazer parte da própria arquitetura do agente.

---

## Principal aprendizado da sessão

```text
PoC de IA
   ↓
Dados e contexto
   ↓
Ferramentas
   ↓
Identidade e segurança
   ↓
Runtime
   ↓
Observabilidade
   ↓
Avaliação
   ↓
Produção e escala
```

O principal desafio de IA agêntica não é somente criar um agente capaz de responder perguntas.

O desafio é criar um agente **confiável, observável, seguro, governável e integrado aos processos reais da organização**.

---

# 2 — Keynote AWS Summit São Paulo 2026

**Horário:** 10:30–11:30
**Speakers principais:** Laura Grit e Cleber Pereira de Morais

A Keynote apresentou a visão da AWS sobre como **IA agêntica está modificando desenvolvimento de software, modernização de aplicações e operação das empresas**.

Uma das principais mensagens foi que a evolução da IA está tornando a produção técnica cada vez mais rápida.

Consequentemente, escrever código representa apenas uma parcela do processo de desenvolvimento.

Elementos como:

* definição do problema;
* planejamento;
* arquitetura;
* contexto;
* especificação;
* segurança;
* governança;
* validação;
* documentação;
* auditoria;

passam a representar uma parcela ainda maior do valor do processo.

---

## Código como commodity

Um conceito apresentado foi a tendência de que **a produção de código se torne cada vez mais acessível por meio de IA**.

Isso não significa que conhecimento de programação deixa de ser importante.

Significa que parte crescente do trabalho mecânico de implementação pode ser acelerada por ferramentas de IA.

O papel do desenvolvedor passa progressivamente de apenas escrever código para também:

* estruturar problemas;
* definir requisitos;
* criar arquitetura;
* fornecer contexto;
* supervisionar agentes;
* revisar decisões;
* validar resultados;
* garantir segurança;
* garantir qualidade.

---

# Kiro

Um dos principais produtos apresentados foi o **Kiro**, ambiente de desenvolvimento com recursos de IA agêntica.

O Kiro procura ir além do modelo:

```text
Prompt → Código
```

e adotar uma abordagem estruturada:

```text
Ideia
↓
Requisitos
↓
Especificação
↓
Design
↓
Implementação
↓
Testes
↓
Validação
↓
Operação
```

Essa abordagem está relacionada ao conceito de **Spec-Driven Development**, no qual especificações passam a ser artefatos fundamentais para orientar o desenvolvimento.

---

## Steering Docs

Os **Steering Docs** são arquivos de contexto persistente utilizados pelo Kiro.

Eles podem armazenar informações como:

* arquitetura;
* stack tecnológica;
* convenções;
* padrões de código;
* regras de negócio;
* estrutura do projeto;
* requisitos;
* boas práticas internas.

Exemplo:

```text
.kiro/
└── steering/
    ├── architecture.md
    ├── coding-standards.md
    ├── product.md
    └── security.md
```

Esses documentos reduzem a necessidade de explicar repetidamente o mesmo contexto ao agente.

---

## Hooks

Os **Hooks** permitem executar automaticamente determinadas ações quando eventos específicos acontecem.

Por exemplo:

```text
Arquivo alterado
      ↓
Hook
      ↓
Agente executa uma ação
      ↓
Teste / revisão / atualização
```

Isso permite utilizar IA não apenas sob demanda, mas como participante automatizado do fluxo de desenvolvimento.

Possíveis aplicações incluem:

* revisar alterações;
* atualizar documentação;
* executar verificações;
* gerar testes;
* analisar padrões;
* manter arquivos de contexto atualizados.

---

# Harness para agentes

Outro conceito relevante apresentado foi a necessidade de construir um **harness**, ou estrutura operacional, ao redor do modelo.

Um modelo isolado possui capacidades limitadas.

Quando inserido dentro de uma arquitetura empresarial, ele pode receber componentes como:

```text
                    ┌──────────────┐
                    │     LLM      │
                    └──────┬───────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
    Identity             Data               Tools
       │                   │                   │
    Memory          Knowledge Base         Compute
       │                   │                   │
    Sandbox          Observability         APIs
```

Esse ambiente fornece ao agente:

* identidade;
* memória;
* dados;
* ferramentas;
* conhecimento;
* capacidade computacional;
* isolamento;
* monitoramento.

O valor do sistema passa, portanto, a depender não apenas do modelo utilizado, mas também da **engenharia existente ao redor dele**.

---

# Case C6 Bank

O C6 Bank apresentou sua experiência utilizando IA no desenvolvimento de software.

O case reforçou que produtividade com IA não depende apenas da adoção de uma ferramenta.

É necessário trabalhar simultaneamente:

* processos;
* governança;
* segurança;
* métricas;
* pessoas.

Entre os resultados divulgados pelo C6 Bank no Summit esteve uma redução de **até 88% no tempo médio entre desenvolvimento e entrada em produção** em determinados processos.

Exemplos apresentados publicamente incluíram reduções como:

```text
Preparação da plataforma de dados:
3 meses → 8 dias

Revisão de conformidade:
2 meses → 8 dias

Desenvolvimento de produtos:
10 sprints → 1 sprint

Migração de sistemas:
8 sprints → 1 sprint
```

O ponto principal do case não foi apenas a velocidade, mas a combinação entre **IA e governança by design**.

A lógica apresentada pode ser resumida em:

### 1. Planejar e governar antes de escalar

Automatizar um processo ruim apenas permite executar um processo ruim mais rapidamente.

Antes da escala é necessário compreender:

* processo;
* riscos;
* responsabilidades;
* segurança;
* métricas;
* governança.

### 2. Medir o processo, não somente a geração de código

Quantidade de código gerado não representa necessariamente produtividade.

É mais relevante analisar indicadores como:

* lead time;
* tempo de entrega;
* qualidade;
* retrabalho;
* incidentes;
* tempo de revisão;
* tempo até produção.

### 3. Investir nas pessoas

Conforme ferramentas de IA se tornam mais acessíveis, o diferencial passa a estar na capacidade das pessoas de utilizá-las corretamente.

---

# Segurança no desenvolvimento com IA

A utilização de IA aumenta a velocidade de geração de software.

Por consequência, também aumenta a necessidade de:

* revisão;
* testes;
* validação;
* auditoria;
* segurança.

Um fluxo apresentado para tratamento de vulnerabilidades pode ser representado por:

```text
Discover
   ↓
Prioritize
   ↓
Validate
   ↓
Remediate
```

### Discover

Identificar vulnerabilidades ou possíveis problemas.

### Prioritize

Determinar quais problemas representam maior risco considerando o contexto da organização.

### Validate

Confirmar se a vulnerabilidade realmente pode ser explorada ou representa risco real.

### Remediate

Gerar ou implementar a correção adequada.

---

# Web Search on Amazon Bedrock AgentCore

Outro recurso relevante é o **Web Search on Amazon Bedrock AgentCore**.

O serviço permite que agentes obtenham informações atuais da web utilizando uma ferramenta gerenciada pela AWS.

A integração ocorre através do **AgentCore Gateway**, utilizando MCP.

Fluxo simplificado:

```text
Agente
   ↓
AgentCore Gateway
   ↓
Web Search Tool
   ↓
Índice Web operado pela Amazon
   ↓
Resultados + fontes
   ↓
LLM
```

Entre os principais recursos estão:

* acesso a informações recentes;
* resultados com título, URL, trechos e data;
* integração via MCP;
* filtros por domínio;
* filtros por data de publicação;
* índice web operado pela Amazon;
* integração com knowledge graph;
* recuperação de trechos semanticamente relevantes.

Um aspecto importante é que as consultas são processadas dentro da infraestrutura AWS, evitando o envio da consulta para mecanismos de busca externos de terceiros.

Isso facilita a adoção em ambientes empresariais com requisitos mais rígidos de segurança e governança.

---

# IA agêntica nas empresas

Outro aprendizado importante da Keynote foi a tendência de adoção de **múltiplos agentes especializados**.

Em vez de:

```text
1 IA → todas as tarefas
```

uma organização pode estruturar:

```text
Agente de vendas
Agente de suporte
Agente de desenvolvimento
Agente de segurança
Agente de dados
Agente financeiro
Agente de documentação
```

Cada agente pode possuir:

* contexto próprio;
* ferramentas específicas;
* permissões diferentes;
* memória;
* fontes de dados;
* responsabilidades;
* regras.

Essa especialização permite maior controle e separação de responsabilidades.

---

# Principal aprendizado da Keynote

A evolução da IA não elimina a importância da engenharia.

Ela desloca parte do esforço.

```text
ANTES

Grande esforço
     ↓
Implementação manual


COM IA

Problema
↓
Contexto
↓
Especificação
↓
Arquitetura
↓
IA / Agentes
↓
Código
↓
Validação
↓
Segurança
↓
Governança
↓
Operação
```

Quanto mais barata e rápida se torna a produção técnica, maior tende a ser a importância da **qualidade das decisões, do contexto e dos processos que orientam essa produção**.

---

# 3 — Construindo Software Como Nunca com IA Agêntica

## Spec-Driven Development

Um dos principais assuntos da sessão foi **Spec-Driven Development**, ou desenvolvimento orientado por especificações.

Em vez de começar diretamente pelo código:

```text
Ideia → Prompt → Código
```

o desenvolvimento passa a utilizar especificações estruturadas:

```text
Ideia
↓
Requisitos
↓
Especificações
↓
Design
↓
Tasks
↓
Implementação
↓
Testes
```

A especificação passa a funcionar como uma fonte de contexto compartilhada entre desenvolvedores e agentes.

---

# Kiro

O Kiro oferece recursos para apoiar esse modelo de desenvolvimento.

Entre eles:

* Spec-Driven Development;
* Steering Docs;
* Hooks;
* agentes;
* integração com MCP;
* ferramentas de desenvolvimento;
* automações;
* contexto persistente do projeto.

---

# MCP — Model Context Protocol

O **Model Context Protocol (MCP)** é um protocolo aberto utilizado para padronizar a comunicação entre aplicações de IA e ferramentas ou fontes externas.

Em termos simplificados:

```text
Agente
   ↓
MCP
   ↓
Ferramentas / sistemas / dados
```

Um servidor MCP pode disponibilizar ferramentas relacionadas a:

* banco de dados;
* APIs;
* documentação;
* GitHub;
* sistemas internos;
* serviços cloud;
* ferramentas corporativas.

Isso reduz a necessidade de criar integrações específicas para cada combinação de agente e ferramenta.

---

# AI-DLC — AI-Driven Development Life Cycle

Outro conceito apresentado foi o **AI-DLC**, metodologia estruturada para integrar agentes de IA ao ciclo de desenvolvimento.

A abordagem formal é organizada em três grandes fases:

```text
1. Inception
      ↓
2. Construction
      ↓
3. Operations
```

---

## 1. Inception

Fase responsável por entender:

> O que deve ser construído e por quê?

Pode envolver:

* análise do workspace;
* entendimento do código existente;
* reverse engineering em projetos brownfield;
* levantamento de requisitos;
* criação de user stories;
* definição da solução;
* planejamento da aplicação.

---

## 2. Construction

Fase responsável por determinar:

> Como a solução será construída?

Pode envolver:

* design funcional;
* requisitos não funcionais;
* arquitetura;
* infraestrutura;
* geração de código;
* testes;
* validações;
* documentação.

---

## 3. Operations

Fase relacionada à operação da solução após sua construção.

Pode envolver atividades relacionadas a:

* implantação;
* monitoramento;
* manutenção;
* análise operacional;
* evolução contínua.

---

# Human in the Loop

AI-DLC não significa entregar todas as decisões para a IA.

O processo mantém **human oversight**, ou supervisão humana, especialmente em decisões importantes.

Um fluxo pode funcionar da seguinte maneira:

```text
Humano define objetivo
        ↓
IA analisa contexto
        ↓
IA propõe solução
        ↓
Humano revisa
        ↓
IA implementa
        ↓
IA testa
        ↓
Humano valida
        ↓
Próxima etapa
```

Isso combina automação com controle.

---

# Brownfield Development

Um ponto particularmente importante é a aplicação da IA em sistemas já existentes.

Antes de modificar o sistema, o agente pode analisar:

* arquitetura atual;
* código existente;
* dependências;
* padrões;
* regras;
* documentação.

A partir disso, pode produzir uma representação contextual do sistema antes de iniciar alterações.

```text
Código existente
      ↓
Análise / Reverse Engineering
      ↓
Contextualização
      ↓
Especificação
      ↓
Alteração
```

Isso é especialmente importante em ambientes corporativos com aplicações legadas.

---

# Papel do desenvolvedor

Com Spec-Driven Development e AI-DLC, o papel do desenvolvedor passa gradualmente de:

```text
Escrever cada linha de código
```

para:

```text
Definir objetivos
↓
Criar contexto
↓
Definir arquitetura
↓
Especificar requisitos
↓
Supervisionar agentes
↓
Validar decisões
↓
Garantir qualidade
```

O conhecimento técnico continua sendo fundamental justamente porque o desenvolvedor precisa avaliar se aquilo que o agente produz está correto.

---

# 4 — Snowflake: Data Cloud, governança e IA sobre dados corporativos

A **Snowflake** esteve entre os patrocinadores do AWS Summit São Paulo 2026 e apresentou sua plataforma voltada ao gerenciamento, processamento, compartilhamento e análise de dados em cloud.

A Snowflake não deve ser entendida apenas como um Data Warehouse.

A plataforma atualmente engloba capacidades relacionadas a:

* Data Warehouse;
* Data Lake;
* Data Engineering;
* Data Sharing;
* aplicações;
* Machine Learning;
* Inteligência Artificial;
* governança;
* agentes de dados.

---

# Arquitetura

Um dos princípios importantes da Snowflake é a separação entre **armazenamento e processamento**.

Isso permite que diferentes workloads utilizem os mesmos dados com recursos computacionais independentes.

Exemplo:

```text
                 Dados
                   │
       ┌───────────┼───────────┐
       │           │           │
     BI          Data        Machine
  Analytics   Engineering    Learning
       │           │           │
   Compute A   Compute B    Compute C
```

Isso permite escalar diferentes cargas de trabalho de maneira independente.

---

# Governança e segurança

A Snowflake possui mecanismos de segurança e governança integrados à plataforma.

Entre eles:

* Role-Based Access Control — RBAC;
* autenticação;
* autorização;
* políticas de acesso;
* masking;
* row access policies;
* auditoria;
* monitoramento;
* lineage;
* controle sobre objetos e dados.

A ideia central é:

```text
Usuário
   ↓
Role
   ↓
Permissões
   ↓
Dados autorizados
```

Isso permite que diferentes áreas utilizem uma plataforma compartilhada sem necessariamente possuírem acesso aos mesmos dados.

---

# Integração de dados

A Snowflake pode atuar como uma camada central de dados corporativos.

```text
SAP
CRM
APIs
Databases
Arquivos
Aplicações
Eventos
    ↓
Ingestão / integração
    ↓
Snowflake
    ↓
Transformação
    ↓
Camada governada
    ↓
Analytics / BI / ML / AI
```

Integrações com ambientes SAP, inclusive SAP S/4HANA, podem fazer parte dessa arquitetura através de conectores, parceiros e pipelines de integração.

Entretanto, Snowflake não deve ser entendida simplesmente como um “conector do SAP”. Ela funciona como uma **plataforma de dados**, podendo receber e combinar informações provenientes de diversas fontes.

---

# Dados estruturados e não estruturados

A plataforma pode trabalhar com diferentes tipos de informação.

### Estruturados

* tabelas;
* registros;
* transações;
* métricas;
* dados ERP.

### Não estruturados

* documentos;
* textos;
* transcrições;
* arquivos;
* informações utilizadas por mecanismos de busca semântica.

Isso é particularmente importante para aplicações modernas de IA.

---

# Snowflake Cortex AI

O ecossistema **Snowflake Cortex AI** fornece recursos de Inteligência Artificial diretamente sobre dados existentes na plataforma.

Entre os componentes relacionados estão:

* Cortex Agents;
* Cortex Search;
* Cortex Analyst;
* AI Functions;
* Semantic Views;
* Snowflake Intelligence.

---

# Semantic Views

As **Semantic Views** criam uma camada semântica sobre os dados.

Elas descrevem conceitos de negócio como:

* métricas;
* dimensões;
* relacionamentos;
* filtros;
* regras.

Por exemplo:

```text
Tabela física:
SALES_FACT

Camada semântica:
Revenue
Customer
Region
Product
Sales Date
Margin
```

Essa camada ajuda sistemas de IA a compreenderem o significado empresarial dos dados, e não apenas nomes de tabelas e colunas.

---

# Cortex Analyst

O Cortex Analyst permite transformar perguntas em linguagem natural em consultas sobre dados estruturados.

Exemplo:

```text
Usuário:
"Qual foi o faturamento por região nos últimos 6 meses?"

            ↓

Cortex Analyst

            ↓

Semantic View

            ↓

SQL

            ↓

Snowflake

            ↓

Resultado
```

Em 2026, a própria Snowflake passou a recomendar a utilização de **Cortex Agents** como camada principal para novos casos, mantendo Cortex Analyst como ferramenta para consulta estruturada dentro desses agentes.

---

# Cortex Search

O **Cortex Search** é voltado à recuperação de informações utilizando busca semântica sobre dados, especialmente conteúdo textual e não estruturado.

Ele pode ser utilizado em arquiteturas de RAG.

Exemplo:

```text
Pergunta
   ↓
Cortex Search
   ↓
Documentos relevantes
   ↓
LLM
   ↓
Resposta contextualizada
```

---

# Cortex Agents

Os **Cortex Agents** funcionam como uma camada de orquestração capaz de utilizar diferentes ferramentas.

Um agente pode combinar:

```text
                 Cortex Agent
                       │
        ┌──────────────┼──────────────┐
        │              │              │
 Cortex Analyst   Cortex Search    Tools
        │              │              │
 Structured      Unstructured      APIs /
    Data             Data          Actions
```

Dessa maneira, uma pergunta pode exigir múltiplas etapas.

Por exemplo:

> "Quais produtos apresentaram aumento de reclamações e queda nas vendas?"

O agente pode:

1. consultar dados de vendas;
2. pesquisar documentos ou registros de reclamação;
3. cruzar os resultados;
4. gerar uma resposta;
5. criar uma visualização.

---

# Snowflake Intelligence

O **Snowflake Intelligence** oferece uma experiência conversacional para usuários interagirem com dados corporativos utilizando linguagem natural.

Um usuário pode perguntar:

```text
"Quais regiões tiveram maior crescimento neste trimestre?"
```

O sistema pode utilizar Cortex Agents e a camada semântica para:

1. interpretar a pergunta;
2. selecionar a fonte apropriada;
3. gerar a consulta;
4. executar a análise;
5. retornar resultados;
6. gerar visualizações.

Isso reduz a necessidade de usuários de negócio conhecerem SQL para determinadas análises exploratórias.

---

# Dashboards e visualizações

A Snowflake também permite gerar visualizações a partir das análises.

Entretanto, consultas em linguagem natural não necessariamente substituem ferramentas tradicionais de BI.

Os dois modelos podem coexistir:

```text
Dashboards
→ indicadores recorrentes e padronizados

IA conversacional
→ perguntas exploratórias e análises ad hoc
```

Para indicadores empresariais que precisam ser acompanhados constantemente, dashboards continuam sendo adequados.

Para perguntas variáveis e investigações, agentes podem fornecer maior flexibilidade.

---

# RAG dentro do ecossistema Snowflake

Uma arquitetura de RAG utilizando Snowflake pode ser representada como:

```text
Documentos / Dados
        ↓
Processamento
        ↓
Cortex Search
        ↓
Recuperação semântica
        ↓
Cortex Agent
        ↓
LLM
        ↓
Resposta
```

Isso permite combinar informações estruturadas e não estruturadas.

---

# Observabilidade de agentes

A Snowflake também disponibiliza observabilidade para Cortex Agents.

É possível analisar informações como:

* histórico das conversas;
* planejamento realizado pelo agente;
* ferramentas selecionadas;
* execução das ferramentas;
* SQL executado;
* geração da resposta;
* geração de gráficos;
* latência;
* feedback.

Isso permite depurar e auditar agentes utilizados em produção.

---

# Visão geral da arquitetura Snowflake

```text
                    FONTES DE DADOS
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
      SAP               APIs             Bancos
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ↓
                 DATA INGESTION
                          ↓
                     SNOWFLAKE
                          ↓
             DATA ENGINEERING / ELT
                          ↓
                 GOVERNED DATA
                          ↓
        ┌─────────────────┼─────────────────┐
        │                 │                 │
       BI                ML                AI
        │                 │                 │
  Dashboards        Models           Cortex AI
                                          │
                              ┌───────────┼───────────┐
                              │           │           │
                           Analyst      Search      Tools
                              └───────────┼───────────┘
                                          ↓
                                    Cortex Agents
                                          ↓
                               Snowflake Intelligence
                                          ↓
                                        Usuário
```

---

# 5 — Principais aprendizados do AWS Summit 2026

Apesar das sessões abordarem tecnologias diferentes, diversos conceitos apareceram repetidamente.

## 1. IA está evoluindo de copilotos para agentes

A evolução pode ser representada como:

```text
Chatbot
   ↓
Copilot
   ↓
Agent
   ↓
Multi-Agent Systems
```

O agente não apenas gera conteúdo.

Ele pode:

* consultar informações;
* utilizar ferramentas;
* executar código;
* interagir com APIs;
* tomar decisões dentro de limites;
* participar de workflows.

---

## 2. Contexto está se tornando um componente central

Uma LLM sem contexto corporativo possui conhecimento limitado sobre a realidade específica de uma empresa.

Por isso, arquiteturas modernas adicionam:

```text
LLM
 +
Context
 +
Data
 +
Memory
 +
Tools
 +
Rules
```

A qualidade do contexto passa a influenciar diretamente a qualidade do sistema.

---

## 3. RAG continua importante, mas não resolve tudo

RAG permite fornecer conhecimento relevante ao modelo.

Entretanto, aplicações corporativas normalmente precisam de uma arquitetura mais ampla:

```text
RAG
+
Tools
+
Identity
+
Memory
+
Observability
+
Security
+
Governance
```

---

## 4. MCP tende a simplificar integrações

MCP cria uma interface padronizada entre agentes e ferramentas.

```text
Antes:

Agent A → integração X → Sistema
Agent B → integração Y → Sistema
Agent C → integração Z → Sistema


Com MCP:

Agents
   ↓
  MCP
   ↓
Tools / Systems
```

Isso facilita reutilização e interoperabilidade.

---

## 5. Segurança precisa acompanhar a velocidade da IA

Se IA permite produzir software mais rapidamente, organizações também precisam aumentar a velocidade de:

* testes;
* revisão;
* segurança;
* validação;
* auditoria.

Caso contrário:

```text
Mais velocidade
      +
Mesmo controle
      =
Mais risco
```

---

## 6. Observabilidade é fundamental para agentes

Em sistemas tradicionais é necessário monitorar aplicações.

Em sistemas agênticos também é necessário compreender o **processo de decisão e utilização de ferramentas**.

Isso envolve analisar:

* prompt;
* contexto;
* ferramentas;
* chamadas;
* resultados;
* latência;
* erros;
* resposta final.

---

## 7. Dados governados são a base da IA empresarial

A IA empresarial depende diretamente da qualidade e governança dos dados.

```text
IA confiável
     ↑
Contexto confiável
     ↑
Dados confiáveis
     ↑
Governança
```

Sem uma base de dados organizada, segura e contextualizada, o potencial dos agentes é limitado.

---

## 8. Desenvolvimento está se tornando mais orientado por especificações

Com agentes capazes de gerar grandes volumes de código, escrever instruções claras e manter contexto estruturado passa a ser cada vez mais importante.

```text
Problema
↓
Contexto
↓
Requisitos
↓
Especificações
↓
Agentes
↓
Código
↓
Validação
```

O **Spec-Driven Development** representa essa mudança.

---

# Conclusão

O AWS Summit São Paulo 2026 mostrou uma mudança importante no estágio atual da Inteligência Artificial.

O foco está deixando de ser apenas:

> "O que uma LLM consegue gerar?"

e passando para:

> "Como construir sistemas de IA capazes de operar com segurança, contexto, dados, ferramentas e governança dentro de processos reais?"

Tecnologias como:

* Amazon Bedrock AgentCore;
* Kiro;
* MCP;
* AI-DLC;
* Web Search;
* Snowflake Cortex Agents;
* Cortex Search;
* Snowflake Intelligence;

representam diferentes partes dessa transformação.

A arquitetura de IA empresarial apresentada ao longo do evento pode ser resumida como:

```text
                        USUÁRIO
                           │
                           ↓
                     AI AGENT
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Context           Memory           Rules
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                          LLM
                           │
                           ↓
                     ORCHESTRATION
                           │
          ┌────────────────┼────────────────┐
          │                │                │
        Tools             Data           Search
          │                │                │
        APIs          Databases          RAG
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                       SECURITY
                           ↓
                     OBSERVABILITY
                           ↓
                      GOVERNANCE
                           ↓
                       BUSINESS
```

O principal aprendizado é que **o modelo de IA é apenas uma parte da solução**.

O valor real surge da combinação entre:

**modelo + contexto + dados + ferramentas + processos + segurança + governança + pessoas.**

À medida que a geração de código e conteúdo se torna mais automatizada, a capacidade de **definir corretamente o problema, estruturar o contexto, organizar os dados, projetar a arquitetura e validar os resultados** tende a se tornar ainda mais relevante.
