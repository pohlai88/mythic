# VS Code Extension Recommendations

**Generated:** 2026-01-10
**Project:** Next.js + React + TypeScript + GraphQL + tRPC + Drizzle ORM

---

## 📚 Documentation Extensions

### ⭐ **JSDoc Generator** (RECOMMENDED)
- **Extension ID:** `crystal-spider.jsdoc-generator`
- **Why:** Most popular JSDoc/TSDoc generator extension
- **Features:**
  - Auto-generates JSDoc comments for functions
  - Supports TypeScript and JavaScript
  - Adds proper types and parameter documentation
  - Highly rated by developers
- **Usage:** Place cursor above function → Command Palette → "Generate JSDoc"

### **JSDoc Tag Completions**
- **Extension ID:** `jeffy-g.jsdoc-tag-completions`
- **Why:** Provides JSDoc tag autocomplete and snippets
- **Features:** Quick insertion of JSDoc tags like `@param`, `@returns`, `@throws`

### **Better Comments**
- **Extension ID:** `aaron-bond.better-comments`
- **Status:** ✅ Already installed
- **Why:** Enhanced comment highlighting for TODO, FIXME, etc.

### **Code Spell Checker**
- **Extension ID:** `streetsidesoftware.code-spell-checker`
- **Status:** ✅ Already installed
- **Why:** Spell checking in comments and documentation

---

## 🔷 GraphQL Extensions (Essential for Your Project)

### **GraphQL: Language Feature Support**
- **Extension ID:** `graphql.vscode-graphql`
- **Why:** Official GraphQL Foundation extension
- **Features:**
  - Autocomplete for GraphQL queries
  - Validation and error detection
  - Go-to definition
  - Hover information
  - Outline view for GraphQL files

### **GraphQL Syntax**
- **Extension ID:** `graphql.vscode-graphql-syntax`
- **Why:** Syntax highlighting for GraphQL files
- **Features:** Proper syntax coloring for `.graphql` and `.gql` files

### **Apollo GraphQL**
- **Extension ID:** `apollographql.vscode-apollo`
- **Why:** Perfect for Apollo Client/Server projects
- **Features:**
  - Intelligent autocomplete
  - Inline errors and warnings
  - Inline field type information
  - Performance insights
  - Schema explorer
  - Project navigation

---

## 🔵 tRPC Extensions

### **tRPC VSCode**
- **Extension ID:** `trpc.trpc-vscode`
- **Why:** Essential for tRPC development
- **Features:**
  - tRPC snippets
  - IntelliSense for tRPC procedures
  - Type-safe autocomplete
  - Quick navigation

---

## 📘 TypeScript Enhancements

### **TypeScript Next**
- **Extension ID:** `ms-vscode.vscode-typescript-next`
- **Why:** Latest TypeScript features and improvements
- **Features:** Access to bleeding-edge TypeScript features

### **Pretty TypeScript Errors**
- **Extension ID:** `yoavbls.pretty-ts-errors`
- **Why:** Better TypeScript error messages
- **Features:**
  - More readable error messages
  - Better error formatting
  - Helpful suggestions

---

## ⚛️ Next.js Enhancements

### **Next.js Snippets**
- **Extension ID:** `pulkitgangwar.nextjs-snippets`
- **Why:** Code snippets for Next.js development
- **Features:**
  - Quick insertion of Next.js patterns
  - API route snippets
  - Server component snippets
  - Client component snippets

### **JSON Support**
- **Extension ID:** `ms-vscode.vscode-json`
- **Why:** Enhanced JSON support for Next.js config files
- **Features:** JSON validation and formatting

---

## 📊 Extension Priority

### 🔴 **High Priority (Install First)**
1. `crystal-spider.jsdoc-generator` - Documentation generation
2. `graphql.vscode-graphql` - GraphQL language support
3. `apollographql.vscode-apollo` - Apollo GraphQL tooling
4. `trpc.trpc-vscode` - tRPC support

### 🟡 **Medium Priority (Very Useful)**
5. `jeffy-g.jsdoc-tag-completions` - JSDoc tag completions
6. `graphql.vscode-graphql-syntax` - GraphQL syntax highlighting
7. `yoavbls.pretty-ts-errors` - Better TypeScript errors
8. `pulkitgangwar.nextjs-snippets` - Next.js snippets

### 🟢 **Low Priority (Nice to Have)**
9. `ms-vscode.vscode-typescript-next` - Latest TypeScript features
10. `ms-vscode.vscode-json` - JSON support (may already be built-in)

---

## 🚀 Installation

### Quick Install (All Extensions)
```powershell
cd .vscode
.\validate-and-activate-extensions.ps1 -InstallMissing
```

### Manual Install (Individual)
```bash
# Documentation
code --install-extension crystal-spider.jsdoc-generator
code --install-extension jeffy-g.jsdoc-tag-completions

# GraphQL
code --install-extension graphql.vscode-graphql
code --install-extension graphql.vscode-graphql-syntax
code --install-extension apollographql.vscode-apollo

# tRPC
code --install-extension trpc.trpc-vscode

# TypeScript
code --install-extension yoavbls.pretty-ts-errors
code --install-extension ms-vscode.vscode-typescript-next

# Next.js
code --install-extension pulkitgangwar.nextjs-snippets
code --install-extension ms-vscode.vscode-json
```

---

## 📝 Usage Examples

### JSDoc Generator
1. Place cursor above any function
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Generate JSDoc"
4. Select the command
5. JSDoc comment is automatically generated!

### GraphQL Extension
- Open any `.graphql` or `.gql` file
- Start typing a query - autocomplete will appear
- Hover over fields to see type information
- Errors are highlighted in real-time

### Apollo GraphQL
- Configure Apollo config file
- Get schema-aware autocomplete
- See inline type information
- Explore your GraphQL schema

### tRPC Extension
- Type `trpc` to see snippets
- Get autocomplete for tRPC procedures
- Navigate to procedure definitions

---

## ✅ Current Status

**Total Recommended Extensions:** 36 (26 existing + 10 new)

**New Extensions Added:**
- ✅ Documentation: JSDoc Generator, JSDoc Tag Completions
- ✅ GraphQL: GraphQL Language Features, GraphQL Syntax, Apollo GraphQL
- ✅ tRPC: tRPC VSCode
- ✅ TypeScript: TypeScript Next, Pretty TypeScript Errors
- ✅ Next.js: Next.js Snippets, JSON Support

---

## 🔗 Resources

- [JSDoc Generator Marketplace](https://marketplace.visualstudio.com/items?itemName=crystal-spider.jsdoc-generator)
- [GraphQL Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=graphql.vscode-graphql)
- [Apollo GraphQL Extension](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)
- [tRPC VSCode Extension](https://marketplace.visualstudio.com/items?itemName=trpc.trpc-vscode)

---

**Last Updated:** 2026-01-10
