
# Sober-Up

This is a Next.js application designed to support individuals on their journey to addiction recovery.

## Features

*   **AI Recovery Plan:** Personalized plans generated based on user input.
*   **Progress Tracking:** Monitor sobriety streaks, milestones, savings, and health benefits.
*   **AI Chat Support:** 24/7 empathetic AI assistant for immediate support and coping strategies.
*   **Relapse Prevention Toolkit:** Includes meditation plans, breathing exercises, distraction tools, and emergency contacts.
*   **Journaling:** Secure digital journal with mood tracking, tagging, and rich text support.
*   **Community Support:** Connect with others in groups like "SoberTown," share progress, pledge, and offer encouragement.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sober-up
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Firebase project configuration and Google AI API key:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID # Optional

    # For Genkit AI features
    GOOGLE_GENAI_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
    You can find your Firebase config details in your Firebase project settings.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) (or the specified port) in your browser.

5.  **(Optional) Run Genkit locally for AI development:**
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit development UI, usually at [http://localhost:4000](http://localhost:4000).

## Building for Production

```bash
npm run build
```

## Deployment (Firebase Hosting with GitHub Actions)

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically deploy the application to Firebase Hosting when changes are pushed to the `main` branch.

**Setup:**

1.  **Push your code to a GitHub repository.**
2.  **Configure GitHub Secrets:**
    *   Go to your repository settings on GitHub: `Settings > Secrets and variables > Actions`.
    *   Add the following **repository secrets**:
        *   `FIREBASE_SERVICE_ACCOUNT_SOBER_UP_OY26Q`: The **entire JSON content** of your Firebase service account key.
            *   To get this, go to Firebase Console > Project Settings > Service accounts > Generate new private key. Copy the downloaded JSON file's content.
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase Web API Key.
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain.
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase Project ID (`road-to-recovery-oy26q`).
        *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket.
        *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID.
        *   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase App ID.
        *   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase Measurement ID (Optional).
        *   `GOOGLE_GENAI_API_KEY`: Your Google AI API Key (for Genkit).

3.  **Push to `main`:** Once secrets are configured, any push to the `main` branch will trigger the workflow, build the app, and deploy it to your Firebase Hosting site (`https://road-to-recovery-oy26q.web.app` or your custom domain).

**Manual Deployment:**

If you prefer manual deployment:

1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Build: `npm run build`
4.  Deploy: `firebase deploy --only hosting`

*(Note: The Genkit AI flows are currently designed to run within the Next.js server environment. For separate deployment of Genkit flows to Cloud Functions, further configuration would be needed.)*
