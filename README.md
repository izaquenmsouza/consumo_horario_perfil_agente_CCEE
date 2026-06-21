# _Pipeline analítico para exploração de 195 milhões de registros horários da CCEE_

Case de portfólio em engenharia analítica desenvolvido a partir de dados abertos da CCEE, com foco na consolidação de arquivos CSV massivos, geração de uma base Parquet otimizada e realização de análises exploratórias sobre consumo horário de energia no Ambiente de Contratação Livre.

## Visão geral**

Este projeto teve como objetivo transformar arquivos CSV de grande volume da base pública CONSUMO_HORARIO_PERFIL_AGENTE, disponibilizada pela CCEE, em uma base analítica única, validada e eficiente para consultas.

A partir da base consolidada, foram realizadas análises temporais, regionais e operacionais para investigar padrões de consumo de energia por mês, submercado, estado, período de comercialização e classe de perfil de agente.

## Objetivos do projeto
1. Consolidar seis arquivos CSV mensais da CCEE em uma base única.
2. Utilizar DuckDB para processar dados de grande volume diretamente do disco.
3. Exportar a base consolidada para o formato Parquet.
4. Validar volume, estrutura e cobertura da base final.
5. Realizar análises exploratórias temporais, regionais e operacionais.
6. Transformar o notebook em uma página de portfólio profissional com foco em storytelling técnico.

## Base de dados

Fonte dos dados:

https://dadosabertos.ccee.org.br/dataset/consumo_horario_perfil_agente

A base contém informações de consumo por agente, carga, cidade, estado, submercado, período de comercialização e métricas de consumo, incluindo:

## Visualização

Uma página web foi desenvolvida no Git Pages para ajudar na visualização das informações:

https://izaquenmsouza.github.io/consumo_horario_perfil_agente_CCEE/

O notebook completo com todo o desenvolvimento:

https://github.com/izaquenmsouza/consumo_horario_perfil_agente_CCEE/blob/main/Unifi_dados_CCEE_Perfil_Agente.ipynb

## Principais resultados

A base consolidada apresentou:

- 195.448.968 registros
- 6 meses de referência
- período de setembro de 2025 a fevereiro de 2026
- 46.453 cargas distintas
- 19.680 perfis de agente
- 2.955 cidades
- 27 estados
- 4 submercados
