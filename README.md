# AzuraJS CLI

Este projeto é o CLI (Command Line Interface) do AzuraJS, uma ferramenta para facilitar o desenvolvimento, gerenciamento e automação de projetos que utilizam o framework AzuraJS.

## Instalação

Clone o repositório e instale as dependências:

```bash
bun install
```

## Uso

Execute o CLI via terminal:

```bash
bun run src/index.ts
```

Ou diretamente pelo binário:

```bash
node bin/azura.js
```

## Funcionalidades

- **Criação de projetos**: Gere rapidamente a estrutura inicial de um projeto AzuraJS.
- **Templates**: Utilize templates prontos para controllers, rotas e configurações.
- **Automação**: Scripts para facilitar tarefas comuns do desenvolvimento.
- **Configuração**: Personalize seu projeto com arquivos de configuração.

## Estrutura do Projeto

- `src/` - Código fonte principal do CLI
- `bin/azura.js` - Arquivo executável do CLI
- `templates/` - Modelos para geração de arquivos
- `package.json` - Gerenciamento de dependências e scripts
- `README.md` - Documentação do projeto

## Scripts Disponíveis

- `bun run src/index.ts` - Inicia o CLI
- `bun run build` - Compila o projeto
- `bun run test` - Executa os testes

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'Minha feature'`)
4. Faça o push para o seu fork (`git push origin minha-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Contato

Dúvidas, sugestões ou problemas? Abra uma issue ou entre em contato pelo [GitHub](https://github.com/azurajs-org).
