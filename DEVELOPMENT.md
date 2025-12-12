# Development Workflow Guide

## 代码质量工具配置

本项目已配置完整的代码质量工具链，包括：

### 🔧 工具列表

- **ESLint**: 代码质量检查和规范
- **Prettier**: 代码格式化
- **Husky**: Git hooks 管理
- **lint-staged**: 提交前代码检查
- **commitlint**: 提交信息规范检查

### 📝 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 类型说明

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统或依赖更新
- `ci`: CI/CD 配置更新
- `chore`: 其他杂项更新
- `revert`: 回滚提交

#### 示例

```bash
feat: add dark mode toggle
fix(ui): resolve button hover state issue
docs: update README with new features
style: format code with prettier
refactor(components): extract common button logic
```

### 🚀 开发流程

1. **开发前**
   ```bash
   npm run dev          # 启动开发服务器
   ```

2. **代码检查**
   ```bash
   npm run lint         # 检查代码质量
   npm run lint:fix     # 自动修复可修复的问题
   npm run format       # 格式化代码
   npm run type-check   # TypeScript 类型检查
   ```

3. **测试**
   ```bash
   npm test             # 运行测试
   npm run test:watch   # 监听模式测试
   npm run test:coverage # 生成覆盖率报告
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### 🔄 自动化流程

#### Pre-commit Hook
提交前自动执行：
- ESLint 检查和修复
- Prettier 格式化
- TypeScript 类型检查

#### Commit-msg Hook
提交时自动检查：
- 提交信息格式规范
- 提交信息长度限制

### ⚙️ 配置文件

- `.eslintrc.json`: ESLint 配置
- `.prettierrc.json`: Prettier 配置
- `.prettierignore`: Prettier 忽略文件
- `commitlint.config.js`: Commitlint 配置
- `.husky/`: Husky Git hooks 配置

### 🛠️ 自定义配置

如需修改规则，请编辑对应的配置文件：

1. **ESLint 规则**: 编辑 `.eslintrc.json`
2. **Prettier 格式**: 编辑 `.prettierrc.json`
3. **提交规范**: 编辑 `commitlint.config.js`

### 📋 常用命令

```bash
# 代码质量
npm run lint              # 检查代码
npm run lint:fix          # 修复代码
npm run format            # 格式化代码
npm run format:check      # 检查格式

# 测试
npm test                  # 运行测试
npm run test:watch        # 监听测试
npm run test:coverage     # 覆盖率报告

# 构建
npm run build             # 构建项目
npm run type-check        # 类型检查

# Git hooks
npm run pre-commit        # 手动运行 pre-commit
```

### 🚨 常见问题

1. **提交被拒绝**
   - 检查代码是否通过 ESLint
   - 检查提交信息是否符合规范

2. **格式化冲突**
   - 运行 `npm run format` 统一格式
   - 确保编辑器配置与 Prettier 一致

3. **类型错误**
   - 运行 `npm run type-check` 检查
   - 修复 TypeScript 类型问题

### 💡 最佳实践

1. **提交前检查**
   - 运行 `npm run lint` 检查代码
   - 运行 `npm test` 确保测试通过
   - 使用规范的提交信息

2. **代码风格**
   - 遵循 ESLint 规则
   - 使用 Prettier 格式化
   - 保持代码简洁清晰

3. **测试覆盖**
   - 为新功能编写测试
   - 保持高测试覆盖率
   - 确保测试通过

---

遵循这些规范可以确保代码质量和团队协作效率！🚀