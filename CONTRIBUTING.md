# Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/task-flow-main.git
   cd task-flow-main
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Code Style

- Follow the existing TypeScript and React conventions
- Use functional components with hooks
- Maintain proper type safety
- Run `npm run lint` before committing

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit with descriptive messages
3. Push to your fork and submit a pull request
4. Ensure all checks pass and code is properly formatted

## Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Prefix with type: `feat:`, `fix:`, `docs:`, `chore:`, etc.

## Issues

- Check existing issues before creating new ones
- Provide detailed reproduction steps for bugs
- Use issue templates when available

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
