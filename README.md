## Component Overview

| **Component**          | **Type**        | **Responsibility**                                                                 |
|------------------------|-----------------|-------------------------------------------------------------------------------------|
| `WarningModal.jsx`     | UI Component    | Custom confirmation modal used before destructive actions (e.g., deleting account). |
| `AccountSettings.jsx`  | Page Component  | Allows users to update username, email, password, or delete account with warning.  |
| `AdminPanel.jsx`       | Page Component  | Grants admin/superadmin ability to delete, edit, or create entries.                |
| `SearchBar.jsx`        | UI Component    | (Planned) Component for keyword + category search across entries.                  |
| `Header.jsx`           | UI Component    | (Planned) Top page bar with logo, search bar, and login/settings toggles.          |
| `SettingsModal.jsx`    | UI Component    | (Planned) Modal with links to Profile, Account Settings, Admin Panel, and Logout.  |
| `Profile.jsx`          | Page Component  | (Planned) Displays user profile information (view mode for now).                   |

## Database Collections

- **users** – Authenticated user data, including roles.
- **entries** – Core wiki data, each with a `category` (e.g., people, echoes, locations).
- **categories** – Optional lookup collection for dynamic category management.
