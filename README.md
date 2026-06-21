# Portfolio CCEE - GitHub Pages

Esta pasta contém uma página single page pronta para GitHub Pages, construída a partir do notebook `Unifi_dados_CCEE_Perfil_Agente.ipynb`.

## Estrutura

```text
portfolio-ccee/
  index.html
  assets/
    css/
      styles.css
    js/
      script.js
  tools/
    convert_notebook.py
  README.md
```

## Como publicar no GitHub Pages

1. Copie o conteúdo desta pasta para o repositório do projeto.
2. Garanta que `index.html` fique na raiz do branch publicado ou dentro da pasta configurada no Pages.
3. No GitHub, acesse `Settings > Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha o branch desejado e a pasta `/root` ou `/docs`, conforme onde você colocou os arquivos.
6. Salve e aguarde a URL pública ser gerada.

## Como atualizar a página no futuro

O arquivo `tools/convert_notebook.py` cria um resumo em JSON do notebook. Ele não substitui curadoria editorial, mas acelera futuras versões ao extrair células, códigos e saídas relevantes.

```bash
python tools/convert_notebook.py caminho/do/notebook.ipynb > notebook-summary.json
```

Fluxo recomendado:

1. Atualize o notebook.
2. Rode o conversor para revisar células Markdown, códigos e outputs.
3. Atualize as seções narrativas do `index.html`.
4. Inclua novos gráficos/tabelas na seção de visualizações.
5. Teste localmente abrindo o `index.html` no navegador.

## Observações

- Os blocos de código ficam ocultos por padrão usando `<details>`.
- A página não depende de frameworks ou build step.
- O layout usa HTML, CSS e JavaScript puro para máxima compatibilidade com GitHub Pages.
