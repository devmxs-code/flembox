# 🎬 FlemBox

Sistema de recomendação de filmes e séries desenvolvido em React, utilizando a API do The Movie Database (TMDB). Aplicação moderna com interface responsiva, suporte a modo escuro e funcionalidades completas de busca, filtros e organização de conteúdo.

## ✨ Funcionalidades

- 🎥 **Busca de Filmes e Séries**: Pesquisa em tempo real com sugestões automáticas
- 🔍 **Filtros Avançados**: Filtro por gênero e ordenação por popularidade, avaliação, data
- ⭐ **Sistema de Avaliação**: Avalie filmes e séries com sistema de estrelas (1-5)
- ❤️ **Favoritos**: Marque seus conteúdos favoritos
- 📌 **Watchlist**: Crie uma lista para assistir depois
- 🌙 **Modo Escuro**: Interface com suporte a tema claro/escuro
- 📱 **Responsivo**: Design adaptável para mobile, tablet e desktop
- 🎨 **Interface Moderna**: UI/UX moderna com Tailwind CSS e animações suaves

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **Framer Motion** - Biblioteca de animações
- **The Movie Database API** - API para dados de filmes e séries

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/flembox.git
cd flembox
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Acesse `http://localhost:3000` no navegador

## 📁 Estrutura do Projeto

```
flembox/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ContentCard/     # Card de conteúdo (grid)
│   │   ├── ContentListItem/ # Item de lista
│   │   ├── ContentModal/    # Modal de detalhes
│   │   ├── Filters/         # Componente de filtros
│   │   ├── Header/          # Cabeçalho da aplicação
│   │   ├── SearchBar/       # Barra de pesquisa
│   │   └── StarRating/      # Componente de avaliação
│   ├── constants/           # Constantes da aplicação
│   │   └── api.js           # Configurações da API
│   ├── hooks/              # Custom hooks
│   │   ├── useContent.js    # Hook para gerenciar conteúdo
│   │   ├── useDarkMode.js   # Hook para modo escuro
│   │   ├── useGenres.js     # Hook para gêneros
│   │   ├── useLocalStorage.js # Hook para localStorage
│   │   └── useSearchSuggestions.js # Hook para sugestões
│   ├── services/           # Serviços
│   │   └── apiService.js    # Serviço de API
│   ├── utils/              # Utilitários
│   │   ├── formatters.js   # Funções de formatação
│   │   └── sorters.js      # Funções de ordenação
│   ├── App.js              # Componente principal
│   ├── index.js            # Ponto de entrada
│   └── index.css           # Estilos globais
├── public/                 # Arquivos públicos
├── package.json            # Dependências do projeto
└── README.md              # Este arquivo
```

## 🏗️ Arquitetura

O projeto segue os princípios **SOLID** e **Clean Code**:

- **Single Responsibility Principle**: Cada componente e função tem uma responsabilidade única
- **Open/Closed Principle**: Componentes extensíveis sem modificação
- **Dependency Inversion**: Uso de hooks e serviços para abstrair dependências
- **Separation of Concerns**: Separação clara entre lógica de negócio, apresentação e dados

### Estrutura de Componentes

- **Componentes Presentacionais**: Componentes focados apenas na apresentação (ContentCard, StarRating)
- **Componentes de Container**: Componentes que gerenciam estado e lógica (App)
- **Custom Hooks**: Lógica reutilizável extraída para hooks (useContent, useLocalStorage)
- **Services**: Lógica de comunicação com APIs isolada (apiService)

## 🎯 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta a configuração do Create React App (irreversível)

## 🔑 API Key

O projeto utiliza a API do TMDB. A chave da API está configurada no arquivo `src/constants/api.js`. Para produção, recomenda-se usar variáveis de ambiente.

## 📝 Funcionalidades Detalhadas

### Busca
- Busca em tempo real com debounce de 300ms
- Sugestões automáticas durante a digitação
- Suporte a filmes e séries

### Filtros
- Filtro por gênero (dinâmico baseado no tipo de conteúdo)
- Ordenação por:
  - Popularidade
  - Avaliação
  - Mais recentes
  - Mais antigos

### Visualização
- Modo Grid: Cards com informações resumidas
- Modo Lista: Lista horizontal com mais detalhes

### Persistência
- Dados salvos no localStorage:
  - Favoritos
  - Watchlist
  - Avaliações
  - Preferência de tema

## 🎨 Customização

### Cores e Tema
O projeto utiliza Tailwind CSS com suporte a modo escuro. As cores podem ser customizadas através do arquivo `tailwind.config.js`.

### API
Para alterar a configuração da API, edite o arquivo `src/constants/api.js`.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando React e Clean Code principles.

## 🙏 Agradecimentos

- [The Movie Database (TMDB)](https://www.themoviedb.org/) pela API gratuita
- Comunidade React pela excelente documentação
- Tailwind CSS pela framework CSS utilitária

---

**Nota**: Este projeto foi desenvolvido para fins educacionais e demonstração de boas práticas de desenvolvimento React.
