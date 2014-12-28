# Plugins

## Example 1: Image gallery

- Read config from `package.json` file.
- Listen to `.image-gallery` on trumpet stream.
- Generate album html, pipe back into trumpet stream.
- Move files into assets/ folder or somewhere else.

## Example 2: Full-text search

- Listen to `body` or something similar on trumpet stream.
- Generate `sitemap.json` file and put it into assets/ somewhere
- Include search script

## Example 3: Google Analytics

- Read config from `package.json` file
- Insert analytics script


# The Stream Pipeline

fs readStream | extension handler | plugin_a | plugin_b | plugin_z | fs writeStream
