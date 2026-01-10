#!/usr/bin/env tsx
/**
 * Test script to verify glob pattern for root-level markdown files
 */

import { glob } from 'glob'

async function testGlob() {
  const rootDir = process.cwd()
  console.log('Root directory:', rootDir)
  console.log('Testing pattern: *.md')
  console.log('cwd:', rootDir)
  console.log('absolute: true\n')

  try {
    // glob() returns Promise<string[]> in glob v11
    const files = await glob('*.md', {
      cwd: rootDir,
      absolute: true,
      ignore: ['node_modules/**', '.git/**', '.next/**', '**/node_modules/**', '.cursor/**'],
    })

    console.log(`Found ${files.length} files via async iteration`)
    if (files.length > 0) {
      console.log('\nFirst 10 files:')
      files.slice(0, 10).forEach((file) => {
        console.log(`  - ${file}`)
      })
    } else {
      console.log('\nNo files found. Testing alternative pattern: **/*.md (recursive)\n')

      // Test alternative pattern
      const allFiles = await glob('**/*.md', {
        cwd: rootDir,
        absolute: true,
        ignore: ['node_modules/**', '.git/**', '.next/**', '**/node_modules/**', '.cursor/**'],
      })

      console.log(`Found ${allFiles.length} total markdown files`)

      // Filter to root only
      const rootFiles = allFiles.filter((file) => {
        const relativePath = file.replace(rootDir, '').replace(/\\/g, '/')
        return !relativePath.includes('/') && relativePath.endsWith('.md')
      })
      console.log(`Found ${rootFiles.length} root-level markdown files`)
      if (rootFiles.length > 0) {
        console.log('\nRoot-level files:')
        rootFiles.slice(0, 10).forEach((file) => {
          console.log(`  - ${file}`)
        })
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

testGlob().catch(console.error)
