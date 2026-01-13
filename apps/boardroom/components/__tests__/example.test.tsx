/**
 * Example React Component Test
 *
 * Demonstrates testing React components with Vitest and React Testing Library.
 */

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

// Example component for testing
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

describe("Greeting Component", () => {
  it("should render greeting with name", () => {
    render(<Greeting name="World" />)

    expect(screen.getByText("Hello, World!")).toBeInTheDocument()
  })

  it("should render greeting with different name", () => {
    render(<Greeting name="Vitest" />)

    expect(screen.getByText("Hello, Vitest!")).toBeInTheDocument()
  })
})
