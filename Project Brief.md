# PROJECT BRIEF: Personal & Collaborative Learning Management System v2.1

## 1. Project Vision & Guiding Principles
To create a flexible, collaborative LMS where users can build, share, and follow structured learning "Pathways."

*   **Principle of Granularity:** All sharing, permissions, and organization should be as granular as possible (at the folder/pathway level).
*   **Principle of Zero Friction:** The user experience for a new user should be seamless, allowing them to start organizing their own content immediately after signup.
*   **Principle of Modularity:** Content (Pathways) should be reusable and composable.

## 2. Key User Stories

*   **User Registration & Onboarding:**
    *   **As a new user, I want to** register with my name, email, and password **so that** I can access the platform.
    *   **As a new user, I want to** have a personal, private workspace automatically created for me on signup **so that** I can start organizing my projects immediately.

*   **Content Organization & Creation:**
    *   **As a user, I want to** create Projects (folders) inside my workspace **so that** I can organize my learning topics.
    *   **As a user, I want to** create nested sub-projects (sub-folders) inside other projects **so that** I can build a deep, logical hierarchy.
    *   **As a user, I want to** create a new Pathway inside a project **so that** I can build a structured learning module for myself or others.
    *   **As a user, I want to** add items to my pathway, including links, videos (by URL), and Markdown documents (by upload) **so that** I can build rich content.
    *   **As a user, I want to** reorder items within a pathway **so that** I can control the learning flow.

*   **Content Consumption & Interaction:**
    *   **As a user, I want to** view a pathway's items as a checklist **so that** I can track my own progress.
    *   **As a user, I want to** use a universal search bar **so that** I can quickly find any project or pathway I have access to.

*   **Collaboration & Sharing:**
    *   **As a user, I want to** set permissions on my project or pathway to either Private, Workspace-wide, or Public **so that** I can control who sees my content.
    *   **As a user, I want to** invite other users by email to my private projects/pathways **so that** we can collaborate on the content.
    *   **As a public visitor, I want to** be able to view public projects and pathways without needing an account **so that** I can consume shared knowledge freely.

## 3. Key Workflows
*   **New Pathway Workflow:** A user selects a Project in their workspace -> Clicks "Create Pathway" -> Enters a title -> Adds items (links, video URLs, markdown) -> Saves the Pathway.
*   **Sharing Workflow:** A user navigates to a Project/Pathway they own -> Clicks "Share" -> Chooses a permission level (Private, Workspace, Public) -> If Private, adds other users' emails to an invite list.