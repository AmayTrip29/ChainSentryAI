# **ChainSentryAI: A Developer's Guide**

## Chapter 1: System Architecture & Design Philosophy

### 1.1. Introduction

ChainSentryAI is a client-side single-page application (SPA) designed for simplicity, performance, and power. Its core purpose is to provide an accessible yet robust interface for AI-driven smart contract auditing. The architecture is intentionally minimalist, eschewing complex build systems and backend servers in favor of a pure frontend solution that communicates directly with the Google Gemini API.

### 1.2. Core Technologies

-   **React 19:** The foundational UI library, chosen for its component-based architecture, efficient state management (`useState`, `useCallback`), and vast ecosystem.
-   **TypeScript:** Provides static typing, enhancing code quality, maintainability, and developer experience by catching errors early.
-   **@google/genai:** The official SDK for interacting with the Gemini API, enabling powerful generative AI capabilities directly from the client.
-   **Tailwind CSS:** A utility-first CSS framework used via CDN for rapid, responsive, and consistent UI development without writing custom CSS.
-   **jsPDF & html2canvas:** A combination of libraries used for the "Export to PDF" functionality, allowing for the conversion of DOM elements into a downloadable PDF document.

### 1.3. High-Level Data Flow

The application's data flow is unidirectional, which is a core principle of React that simplifies state management and debugging.

```
[User Input: Code & Blockchain]
       |
       v
[AuditForm.tsx: captures input]
       |
       v
[App.tsx: handles 'onAudit' event, sets loading state]
       |
       v
[geminiService.ts: constructs prompt, calls Gemini API]
       |
       v (async)
[Google Gemini API: processes request, returns JSON]
       |
       v
[geminiService.ts: parses JSON response]
       |
       v
[App.tsx: receives findings, calculates summary, sets report state]
       |
       v
[AuditReportDisplay.tsx: receives report prop, renders UI]
       |
       v
[User views report & optionally exports to PDF]
```

### 1.4. Design Rationale & Trade-offs

-   **Client-Side Only:** The decision to make this a purely client-side application simplifies deployment (can be hosted on any static site host) and reduces infrastructure costs. The primary trade-off is that the **API key must be managed on the client**, which requires a secure environment where `process.env.API_KEY` can be injected at runtime. This is not suitable for a public-facing production app without a backend proxy to protect the key.
-   **CDN Dependencies:** Using an `importmap` and CDN links for dependencies eliminates the need for a package manager (like npm/yarn) and a bundler (like Vite/Webpack). This makes the project extremely portable and easy to run. The trade-off is a reliance on CDN availability and slightly less optimal performance compared to a bundled, tree-shaken application.

## Chapter 2: Component Deep Dive

### 2.1. `App.tsx` - The State Orchestrator

This is the root component that manages the application's global state and orchestrates the interactions between its children.

-   **State Management:**
    -   `isLoading (boolean)`: Controls the display of the loader and disables form inputs.
    -   `error (string | null)`: Stores any error messages from the API call or validation.
    -   `report (AuditReport | null)`: Holds the final, processed audit report data.
-   **Core Logic:**
    -   `handleAudit`: A `useCallback`-memoized function passed to `AuditForm`. It validates input, sets loading states, calls the `auditContract` service, processes the returned findings into a full report (including the summary), and handles any errors.
    -   `handleExportPDF`: Uses the `reportRef` (a `useRef` hook attached to the report's root `div`) to trigger `html2canvas`, which creates a PNG of the report. This image is then added to a `jsPDF` instance and saved.

### 2.2. `AuditForm.tsx` - The User Interface

A controlled component responsible for collecting user input.

-   **Props:** `onAudit` (callback function), `isLoading` (boolean).
-   **Internal State:** Manages the `code` (string) and `blockchain` (enum) values.
-   **Functionality:** Disables its inputs when `isLoading` is true. On form submission, it prevents the default browser action and calls the `onAudit` prop with the current state.

### 2.3. `AuditReportDisplay.tsx` - The Data Presenter

This component's sole responsibility is to render the `AuditReport` object in a clean and readable format.

-   **Logic:** It first sorts the findings based on a predefined severity order (`Critical` > `High` > etc.) to ensure the most important issues are listed first. It then maps over the sorted findings to render individual `FindingCard` components.
-   **Sub-components:** Uses `SeverityBadge` to display the summary counts.

### 2.4. `FindingCard.tsx` - The Atomic Unit of the Report

An interactive, collapsible component that displays a single vulnerability.

-   **State:** `isOpen (boolean)` controls the visibility of the finding's details.
-   **Styling:** A helper function `getSeverityStyles` returns the appropriate Tailwind CSS classes based on the finding's severity, thematically coloring the card.
-   **UI:** The header is always visible, providing a quick summary. The body, containing the detailed description, impact, recommendation, and `CodeBlock`, is toggled by the `isOpen` state.

## Chapter 3: The AI Auditing Service (`geminiService.ts`)

This module is the heart of the application, responsible for all communication with the Gemini API.

### 3.1. Prompt Engineering

The `prompt` string is meticulously crafted to elicit the best possible response from the model. Key elements include:
1.  **Role-playing:** "You are an expert smart contract security auditor..." This sets the context and persona for the AI.
2.  **Explicit Instructions:** "Your task is to identify all potential security risks..." and "Analyze the following... with the thoroughness of tools like Slither..."
3.  **Strict Output Formatting:** "**Your response MUST be a valid JSON array...**" and "**Do not include any text... outside of the JSON array.**" This is the most critical instruction, ensuring the response can be parsed reliably.

### 3.2. Structured Output with `responseSchema`

To enforce the JSON output format, we provide a `responseSchema` in the API call's `config`.
-   `auditResponseSchema`: Defines the expected output as an `ARRAY` of objects.
-   `auditFindingSchema`: Defines the structure of each object within the array, specifying the `type` and `description` for each field (`vulnerability`, `severity`, etc.).
This use of schema is a powerful Gemini API feature that significantly increases the reliability of getting machine-readable output.

### 3.3. API Call & Configuration

-   `model: "gemini-2.5-flash"`: Chosen for its balance of speed, capability, and cost-effectiveness for this type of structured analysis task.
-   `responseMimeType: "application/json"`: Explicitly tells the model to generate a JSON response.
-   `temperature: 0.1`: A low temperature is crucial for an analytical task like auditing. It makes the model's output more deterministic and factual, reducing the chance of creative "hallucinations" and sticking to the identified vulnerabilities.

### 3.4. Error Handling

The `try...catch` block is essential for a good user experience. It handles potential API failures (e.g., invalid key, network issues, model overload) and translates them into user-friendly error messages displayed in the UI.

## Chapter 4: Data Structures (`types.ts`)

This file provides the single source of truth for the application's data shapes.

-   **`Blockchain` (enum):** Improves code readability and prevents errors from typos (e.g., `Blockchain.Ethereum` vs. `"ethereum"`).
-   **`Severity` (type alias):** Defines the five possible severity levels.
-   **`AuditFinding` (interface):** The core data structure for a single vulnerability. Its shape directly matches the `auditFindingSchema` used in the Gemini API call.
-   **`AuditReport` (interface):** The top-level data structure that combines an array of `AuditFinding`s with a calculated `summary` object. This is the main data structure held in the `App.tsx` component's state.

## Chapter 5: Maintenance & Extension Guide

### 5.1. How to Add a New Blockchain

1.  **Update `types.ts`:** Add the new blockchain to the `Blockchain` enum (e.g., `Cardano = 'Cardano (Plutus)'`).
2.  **Update `AuditForm.tsx`:** Add a new `<option>` element to the `select` dropdown. Update the `placeholder` logic in the `textarea` if desired.
3.  **Update `geminiService.ts`:** The `auditContract` function already accepts the `blockchain` as a parameter and includes it in the prompt. The AI model should be able to adapt, but you may want to refine the prompt to include specific knowledge about the new blockchain's common vulnerabilities for better results.

### 5.2. How to Modify the Audit Analysis

-   To change **what** the AI looks for, modify the `prompt` string in `geminiService.ts`. You could add instructions to focus on gas optimization, check for specific attack vectors (e.g., flash loan attacks), or ignore certain types of informational findings.
-   To change the **structure** of the findings, you must update three places in sync:
    1.  The `AuditFinding` interface in `types.ts`.
    2.  The `auditFindingSchema` object in `geminiService.ts`.
    3.  The JSX in `FindingCard.tsx` and `AuditReportDisplay.tsx` to render the new data structure.

### 5.3. Improving PDF Export

The current `html2canvas` implementation is simple but has limitations, especially with content that overflows a single page. For a more robust solution, consider replacing it with a library that generates the PDF programmatically. You would loop through the `report.findings` array and use the PDF library's API (like `pdf.text()`, `pdf.rect()`) to draw each section of the report. This gives you full control over layout, pagination, and styling.
