#!/usr/bin/env tsx
/**
 * List Figma Files
 *
 * Lists all accessible Figma files for the authenticated user.
 * Useful for finding file keys.
 *
 * Usage:
 *   pnpm figma:list-files
 */

/**
 * List Figma files via API
 */
async function listFigmaFiles(): Promise<void> {
  console.log("\n📁 Listing Figma Files\n")

  const apiToken = process.env.FIGMA_API_TOKEN

  if (!apiToken) {
    console.error("❌ Missing FIGMA_API_TOKEN environment variable")
    console.log("\nSet it in .env.local:")
    console.log("FIGMA_API_TOKEN=your_figma_token_here")
    process.exit(1)
  }

  try {
    // Get user's teams
    const teamsResponse = await fetch("https://api.figma.com/v1/teams", {
      headers: {
        "X-Figma-Token": apiToken,
      },
    })

    if (!teamsResponse.ok) {
      const error = await teamsResponse.text()
      throw new Error(`Failed to fetch teams: ${teamsResponse.status} - ${error}`)
    }

    const teamsData = await teamsResponse.json()
    const teams = teamsData.teams || []

    if (teams.length === 0) {
      console.log("⚠️  No teams found")
      return
    }

    console.log(`Found ${teams.length} team(s)\n`)

    // Get files for each team
    for (const team of teams) {
      console.log(`\n📦 Team: ${team.name} (${team.id})`)
      console.log("─".repeat(50))

      try {
        const projectsResponse = await fetch(`https://api.figma.com/v1/teams/${team.id}/projects`, {
          headers: {
            "X-Figma-Token": apiToken,
          },
        })

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          const projects = projectsData.projects || []

          for (const project of projects) {
            console.log(`\n  📁 Project: ${project.name}`)

            const filesResponse = await fetch(
              `https://api.figma.com/v1/projects/${project.id}/files`,
              {
                headers: {
                  "X-Figma-Token": apiToken,
                },
              }
            )

            if (filesResponse.ok) {
              const filesData = await filesResponse.json()
              const files = filesData.files || []

              for (const file of files) {
                console.log(`    📄 ${file.name}`)
                console.log(`       Key: ${file.key}`)
                console.log(`       URL: https://www.figma.com/file/${file.key}/${file.name}`)
              }
            }
          }
        }
      } catch (error) {
        console.error(`  ❌ Error fetching projects: ${error}`)
      }
    }

    console.log("\n✅ File listing complete!")
  } catch (error) {
    console.error("\n❌ Failed to list files:", error)
    process.exit(1)
  }
}

async function main() {
  try {
    await listFigmaFiles()
  } catch (error) {
    console.error("List files error:", error)
    process.exit(1)
  }
}

main()
