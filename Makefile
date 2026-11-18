.PHONY: help install dev build preview lint lint-fix format type-check test test-watch coverage clean check

# Default target
.DEFAULT_GOAL := help

help: ## Mevcut komutlari listeler
	@echo "Kullanim: make [hedef]"
	@echo ""
	@echo "Komutlar:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Bagimliliklari yukler
	npm install

dev: ## Yerel gelistirme sunucusunu baslatir (http://localhost:5173)
	npm run dev

build: ## Uretim derlemesi olusturur (dist/)
	npm run build

preview: ## Uretim derlemesini yerel olarak onizler
	npm run preview

lint: ## ESLint kod kalitesi kontrolu yapar
	npm run lint

lint-fix: ## ESLint hatalarini otomatik duzeltir
	npm run lint-fix

format: ## Prettier ile kod formatlar
	npm run format

type-check: ## TypeScript tip kontrollerini calistirir
	npm run type-check

test: ## Birim testleri tek seferlik calistirir
	npm test -- --run

test-watch: ## Birim testleri izleme (watch) modunda calistirir
	npm test

coverage: ## Test kapsama (coverage) raporu olusturur
	npm run test:coverage

clean: ## Derleme ciktilarini temizler
	rm -rf dist

check: lint type-check test ## Tum dogrulamalari calistirir (lint, type-check, test)
