# VS Code Extension Usage Guide

## Utilities Extensions (Lines 75-78)

### 1. **TODO Highlight** (`wayou.vscode-todo-highlight`)
**Purpose**: Highlights TODO, FIXME, NOTE, and other comment keywords in your code.

#### How to Use:
- **Automatic**: Works automatically once installed - no configuration needed
- **Supported Keywords**: `TODO`, `FIXME`, `NOTE`, `HACK`, `XXX`, `BUG`, `OPTIMIZE`
- **Custom Keywords**: Add custom keywords in settings:
  ```json
  "todohighlight.keywords": [
    {
      "text": "REVIEW:",
      "color": "#ff6b6b",
      "backgroundColor": "transparent"
    }
  ]
  ```

#### Example Usage:
```typescript
// TODO: Refactor this function to use async/await
function fetchData() {
  // ...
}

// FIXME: This causes memory leaks
const cache = new Map();

// NOTE: This is a workaround for issue #123
const temp = workaround();
```

#### Benefits:
- ✅ Visual reminders of tasks in your code
- ✅ Easy to spot areas needing attention
- ✅ No manual tracking needed

---

### 2. **TODO Tree** (`gruntfuggly.todo-tree`)
**Purpose**: Creates a tree view in the sidebar showing all TODO comments across your project.

#### How to Use:
1. **Open TODO Tree**:
   - Click the TODO Tree icon in the Activity Bar (left sidebar)
   - Or use Command Palette: `Ctrl+Shift+P` → "TODO Tree: Focus on TODO Tree View"

2. **View TODOs**:
   - Expand folders to see all TODO comments
   - Click any TODO to jump to that line in the code
   - Filter by keyword (TODO, FIXME, etc.)

3. **Configure Keywords**:
   ```json
   "todo-tree.general.tags": [
     "TODO",
     "FIXME",
     "HACK",
     "NOTE",
     "REVIEW",
     "BUG"
   ]
   ```

#### Example Workflow:
```
TODO Tree View:
├── src/
│   ├── components/
│   │   └── Button.tsx [TODO: Add loading state]
│   └── utils/
│       └── helpers.ts [FIXME: Memory leak here]
└── pages/
    └── api/
        └── users.ts [NOTE: Rate limiting needed]
```

#### Benefits:
- ✅ Project-wide TODO overview
- ✅ Quick navigation to todos
- ✅ Track progress on code improvements
- ✅ Great for code reviews

---

### 3. **Project Manager** (`alefragnani.project-manager`)
**Purpose**: Save and quickly switch between multiple projects/workspaces.

#### How to Use:

1. **Save Current Project**:
   - Command Palette: `Ctrl+Shift+P` → "Project Manager: Save Project"
   - Or use shortcut: `Ctrl+Alt+S` (Windows)
   - Give it a name (e.g., "mythic-nextjs")

2. **List All Projects**:
   - Command Palette: `Ctrl+Shift+P` → "Project Manager: List Projects to Open"
   - Or use shortcut: `Ctrl+Alt+P` (Windows)
   - Shows all saved projects

3. **Quick Switch**:
   - Command Palette: `Ctrl+Shift+P` → "Project Manager: Edit Projects"
   - Edit project names/paths

4. **Project Manager View**:
   - Click "Project Manager" icon in Activity Bar
   - See all saved projects in sidebar
   - Click to open any project

#### Example Projects:
```
Project Manager:
├── mythic (current)
├── personal-blog
├── e-commerce-app
└── learning-projects
```

#### Configuration:
```json
{
  "projectManager.git.baseFolders": [
    "C:\\Projects",
    "C:\\AI-BOS"
  ],
  "projectManager.sortList": "Saved"
}
```

#### Benefits:
- ✅ Quick project switching
- ✅ No need to browse folders
- ✅ Organize multiple projects
- ✅ Great for freelancers/consultants

---

### 4. **Code Runner** (`formulahendry.code-runner`)
**Purpose**: Run code snippets or files directly in VS Code without leaving the editor.

#### How to Use:

1. **Run Current File**:
   - Click the "Run Code" button (▶️) in the top-right corner
   - Or use shortcut: `Ctrl+Alt+N` (Windows)
   - Or right-click file → "Run Code"

2. **Run Selected Code**:
   - Select code snippet
   - Right-click → "Run Code"
   - Or use shortcut: `Ctrl+Alt+N`

3. **Stop Running Code**:
   - Click "Stop Code Run" button (⏹️)
   - Or use shortcut: `Ctrl+Alt+M`

#### Supported Languages:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- PHP
- Go
- Ruby
- And many more...

#### Configuration:
```json
{
  "code-runner.runInTerminal": true,
  "code-runner.clearPreviousOutput": true,
  "code-runner.saveFileBeforeRun": true,
  "code-runner.executorMap": {
    "javascript": "node",
    "typescript": "ts-node",
    "python": "python -u"
  }
}
```

#### Example Usage:
```typescript
// Select this code and press Ctrl+Alt+N
const greet = (name: string) => {
  console.log(`Hello, ${name}!`);
};

greet("World");
// Output: Hello, World!
```

#### Benefits:
- ✅ Quick code testing
- ✅ No need to switch to terminal
- ✅ Test snippets without running full app
- ✅ Great for learning/debugging

---

## Quick Reference

### Keyboard Shortcuts:

| Extension       | Action        | Shortcut                     |
| --------------- | ------------- | ---------------------------- |
| TODO Tree       | Focus view    | `Ctrl+Shift+P` → "TODO Tree" |
| Project Manager | Save project  | `Ctrl+Alt+S`                 |
| Project Manager | List projects | `Ctrl+Alt+P`                 |
| Code Runner     | Run code      | `Ctrl+Alt+N`                 |
| Code Runner     | Stop code     | `Ctrl+Alt+M`                 |

### Best Practices:

1. **TODO Highlight + TODO Tree**:
   - Use consistent keywords (TODO, FIXME, etc.)
   - Review TODO Tree weekly
   - Clean up completed TODOs

2. **Project Manager**:
   - Save projects with descriptive names
   - Organize by client/category
   - Use for quick context switching

3. **Code Runner**:
   - Use for quick tests/debugging
   - Don't use for production code
   - Great for learning new APIs

---

## Integration Tips

### Combine Extensions:
- Use **TODO Highlight** for visual reminders while coding
- Use **TODO Tree** for project-wide task management
- Use **Project Manager** to organize multiple projects
- Use **Code Runner** for quick testing during development

### Workflow Example:
1. Write code with TODO comments
2. See highlights in editor (TODO Highlight)
3. Review all TODOs in sidebar (TODO Tree)
4. Test code snippets quickly (Code Runner)
5. Switch between projects easily (Project Manager)

---

**Need Help?**
- Check extension settings: `Ctrl+,` → search extension name
- View extension docs: Click extension → "Details" → "Documentation"
- Report issues: Extension marketplace page
