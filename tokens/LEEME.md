# Tokens comunes de Pinto

`pinto-tokens.css` es la copia de la paleta común (Paleta A «Mar»), v1. Todas las apps de Pinto llevan una copia idéntica.
El bloque de colores de `index.html` y `preview-v12.html` debe ser igual a este archivo.

Verificar (revisión estática, no prueba la app corriendo):

    python3 tools/pinto_tokens_check.py tokens/pinto-tokens.css index.html preview-v12.html

Para cambiar un color: cambiar el archivo común, subir la versión y pasar el verificador en todas las apps.
