# Formulary Frontend

This document outlines the purpose and functionality of each page within the `client/src/pages` directory of the Formulary application. The frontend is built using React and styled with Tailwind CSS, strictly adhering to the "Clinical Atelier" design system.

## Pages Overview

### 1. `SearchPage.jsx`
- **Purpose**: The main landing and entry point for users.
- **Functionality**: Provides a prominent, clean search bar where users can look up medicines by name or formula. It captures user input and navigates to the `SearchResultPage` with the search query.

### 2. `SearchResultPage.jsx`
- **Purpose**: Displays the results of a user's medicine search.
- **Functionality**: Fetches search results from the backend API. Presents a list of matched medicines, showing high-level details. Users can click on a specific medicine to view its detailed profile.

### 3. `MedicineDetailPage.jsx`
- **Purpose**: Shows comprehensive details for a single medicine.
- **Functionality**: Displays full data for a selected medicine, including its formula, price, manufacturer, and usage instructions. Provides a call-to-action to view available substitutes.

### 4. `SubstituteComparisonPage.jsx`
- **Purpose**: Allows users to compare a prescribed medicine against its generic alternatives.
- **Functionality**: Fetches substitute medicines based on the primary medicine's formula. Displays a side-by-side or stacked comparative view focusing on price differences, manufacturer reputation, and savings percentages.

### 5. `SigninPage.jsx` & `SignupPage.jsx`
- **Purpose**: Authentication pages for user access.
- **Functionality**: Handles user registration and login securely. Integrates with the backend authentication endpoints and manages local storage of authentication tokens. Styled with locked viewports for a sleek, minimal aesthetic.

### 6. `ProfilePage.jsx`
- **Purpose**: User dashboard for personal settings.
- **Functionality**: Displays user information, saved searches, and account management options.

### 7. `AdminPage.jsx`
- **Purpose**: The master dashboard for platform administrators.
- **Functionality**: Protected route for admins to manage the entire medicine database. Features include:
  - Live system metrics (total medicines, formulas, etc.).
  - Complete CRUD interface for medicines.
  - Ability to manually link or unlink substitute medicines.
  - Bulk CSV upload capabilities.
