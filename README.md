# Alumni Cell Portal

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express&logoColor=fff)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=fff)](https://mongoosejs.com/)

Alumni Cell Portal is a full-stack web application for the Alumni Cell of IIT Indore. It presents alumni initiatives, publications, mentors, events, sponsors, gallery media, and alumni contributions through a React frontend backed by an Express and MongoDB API.

The project also includes an admin dashboard for managing most public content, including mentors, KYA profiles, publications, events, gallery photos, sponsors, and alumni contribution entries.

## Features

- Public home page for Alumni Cell content, recent gallery photos, upcoming events, programs, and Saathi banner content.
- KYA profile listing with backend-managed alumni profile data.
- Newsletter, magazine, and yearbook sections with PDF/flipbook-style viewing.
- Mentor registration form and verified mentors directory.
- CV review submission form for IIT Indore institute email addresses.
- Public events and program listing with detail pages.
- Public gallery page backed by uploaded image records.
- Sponsors page backed by sponsor records.
- Alumni contributors page backed by alumni contribution records.
- Admin login using email/password credentials stored in MongoDB.
- Cookie-based JWT session validation for protected admin access.
- Admin dashboard for managing:
  - Mentors
  - Programs and events
  - Upcoming events
  - KYA profiles
  - Newsletters
  - Magazines
  - Yearbooks
  - Gallery photos
  - Sponsors
  - Alumni contributions
- Image uploads for profiles, mentors, programs, events, gallery, sponsors, and alumni contributions.
- PDF uploads for newsletters and magazines.
- MongoDB models for users, admins, mentors, KYA profiles, publications, programs, events, gallery, sponsors, alumni contributions, and CV submissions.

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router DOM |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only cookies, bcrypt |
| State Management | React `useState`, `useEffect`, small Context API helpers for publication/flipbook views |
| Styling | CSS modules/files, Tailwind CSS, Bootstrap, Framer Motion/GSAP animations |
| UI Libraries | React Icons, Font Awesome, Lucide React, hamburger-react, Swiper, Slick Carousel |
| PDF/Flipbook | react-pdf, react-pageflip |
| File Uploads | multer, Cloudinary for PDFs, Openinary-style upload API for images |
| Build Tools | Vite, ESLint, PostCSS, Autoprefixer |
| Deployment | Static frontend build plus Node/Express backend connected to MongoDB |

## Project Structure

```text
.
├── client/                 # React/Vite frontend application
│   ├── public/             # Static images, PDFs, logos, sponsor assets, sitemap
│   └── src/
│       ├── api/            # Shared API base URL helpers
│       ├── Components/     # Reusable UI and feature components
│       ├── context/        # React context objects used by publication views
│       ├── Home/           # Home page implementation and styles
│       ├── lib/            # Static local data used by frontend pages
│       ├── pages/          # Route-level page components
│       ├── routes/         # Route guards
│       └── styles/         # Page/component CSS files
├── server/                 # Express/Mongoose backend application
│   ├── config/             # Cloudinary configuration
│   ├── controllers/        # Request handlers and business logic
│   ├── middleware/         # multer upload configuration
│   ├── models/             # Mongoose schemas/models
│   ├── routes/             # Express routers
│   ├── utils/              # Shared backend helpers
│   └── index.js            # Server entry point
├── start.bat               # Windows helper to run client and server dev processes
├── package.json            # Root-level dependency metadata
└── package-lock.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database URI
- Cloudinary account for newsletter and magazine PDF uploads
- Openinary-compatible upload endpoint for image uploads, or an equivalent service matching the existing upload API
- Google OAuth client ID only if the Google provider wrapper is kept enabled in the frontend

### Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

The root package currently contains only upload-related dependencies. The application itself is run from `client/` and `server/`.

### Environment Variables

Create environment files in `client/.env` and `server/.env`. Do not commit real secrets.

| Variable | Location | Required For | Notes |
| --- | --- | --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | `client/.env` | Google OAuth provider initialization | Read by `client/src/main.jsx`. Google login UI is currently commented out, but the provider is still mounted. |
| `PORT` | `server/.env` | Backend server port | Defaults to `3008` when not set. |
| `MONGO_URI` | `server/.env` | MongoDB connection | Preferred by `server/index.js` when present. |
| `MONGODB_LINK` | `server/.env` | MongoDB connection | Fallback used by `server/index.js`; present in the current server env file. |
| `JWT_SECRET` | `server/.env` | JWT signing and validation | Used for the `appToken` cookie. |
| `GOOGLE_CLIENT_ID` | `server/.env` | Commented Google auth flow | Referenced only in commented backend Google auth code. |
| `GOOGLE_CLIENT_SECRET` | `server/.env` | Google auth setup | Present in env file; not used by active backend code. |
| `CLOUDINARY_CLOUD_NAME` | `server/.env` | Cloudinary uploads | Used by `server/config/cloudinary.js`. |
| `CLOUDINARY_API_KEY` | `server/.env` | Cloudinary uploads | Used by newsletter and magazine PDF upload flows. |
| `CLOUDINARY_API_SECRET` | `server/.env` | Cloudinary uploads | Used by newsletter and magazine PDF upload flows. |
| `OPENINARY_API_KEY` | `server/.env` | Image uploads | Used by `server/utils/openinary.js`. |
| `OPENINARY_URL` | `server/.env` | Image uploads and image URL construction | Used by image upload controllers and gallery routes. |

### Running Development Server

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

On Windows, the included helper starts both processes in separate terminals:

```bat
start.bat
```

### Building

Build the frontend:

```bash
cd client
npm run build
```

Start the production backend:

```bash
cd server
npm start
```

### Production Deployment

1. Build the frontend with `npm run build` from `client/`.
2. Deploy `client/dist` to a static hosting service or serve it behind the same domain as the API.
3. Deploy the backend from `server/` as a Node.js service.
4. Provide the server environment variables listed above.
5. Ensure the backend can reach MongoDB and the configured upload providers.
6. Configure CORS and reverse proxy paths for the deployed frontend domain.

The backend currently allows CORS from `https://alumnicell.iiti.ac.in`. Update `server/index.js` if deploying the frontend to another origin.

## Architecture

### Request Flow

The React app is rendered by Vite during development and by the static frontend build in production. Browser routes are handled by React Router. Pages and components call the backend using `axios` or `fetch`, with most API calls built from the shared `API_BASE_URL` in `client/src/api/alumni.js`.

The Express server receives API requests, applies JSON/body parsing, cookie parsing, CORS, and route-specific multer middleware where files are uploaded. Route handlers call controller functions, which read or write MongoDB documents through Mongoose models.

### State Flow

Most frontend state is local component state. Pages fetch data in `useEffect`, store it with `useState`, and render lists/forms from that state. Publication pages use lightweight React contexts from `client/src/context/NMcontext.js` to switch between gallery and individual flipbook views and to pass the selected PDF URL.

### Authentication Flow

Admin access is checked through `GET /api/auth/check`. The login form posts credentials to `POST /api/auth/alumni/login`. The backend verifies the email/password against the `Alumni_db` collection, signs a JWT, and stores it in an HTTP-only `appToken` cookie.

Protected frontend admin routes call `/api/auth/check` with credentials. If the returned role is `admin`, the admin dashboard is shown. Logout clears the `appToken` cookie through `POST /api/auth/logout`.

Google OAuth code exists in comments on both frontend and backend. It is not active in the current implementation.

### Data Flow

- Public pages fetch content from the API and render lists, cards, galleries, and PDF viewers.
- Admin forms submit JSON or multipart form data to Express routes.
- Image uploads are accepted with multer, sent to the Openinary-style upload service, then stored in MongoDB as URLs.
- Newsletter and magazine PDFs are accepted with multer, uploaded to Cloudinary as raw files, then stored in MongoDB as PDF URLs and Cloudinary public IDs.
- MongoDB stores the application records; uploaded file binaries are stored outside MongoDB by the upload providers.

### API Communication

The frontend uses a hard-coded production API base URL:

```js
export const API_BASE_URL = "https://alumnicell.iiti.ac.in";
```

The Vite dev server also defines proxies for `/api` and `/alumni-api`, but the active client code mainly calls the production base URL directly.

### Folder Responsibilities

- `client/src/pages`: route-level screens such as admin dashboard, publications, event pages, sponsors, and contributions.
- `client/src/Components`: reusable components and feature sections used by pages.
- `client/src/Home`: home page layout and animations.
- `client/src/api`: shared API constants/helpers.
- `server/routes`: URL-to-controller mapping.
- `server/controllers`: request handling, validation, uploads, and database operations.
- `server/models`: MongoDB document schemas.
- `server/middleware`: upload handling and file type filters.
- `server/config`: third-party service configuration.

## Major Components

| Module | Purpose |
| --- | --- |
| `client/src/App.jsx` | Defines the main route tree, navbar/footer layout, and admin route guard. |
| `client/src/Home/Home.jsx` | Public landing page with animated sections, gallery preview, upcoming events, programs, and Saathi banner. |
| `client/src/pages/AdminDashboard.jsx` | Central dashboard for content management across mentors, events, publications, gallery, sponsors, and contributors. |
| `client/src/Components/FlipbookPage/Flipbook.jsx` | Renders selected PDFs with page-flip controls, fullscreen, download, and share actions. |
| `client/src/Components/RegistrationForm/RegistrationForm.jsx` | Mentor registration form that submits profile data and image uploads. |
| `client/src/Components/CVReviewPage/CVReviewForm.jsx` | CV review submission form with target profile selection. |
| `client/src/Components/Navbar/Navbar.jsx` | Responsive navigation, publication dropdown, role-aware dashboard link, and admin user menu. |
| `server/index.js` | Express app setup, middleware, route mounting, MongoDB connection, and server startup. |
| `server/controllers/admin.controller.js` | Main content management logic for KYA, mentors, events, publications, and admin profile updates. |
| `server/controllers/authController.js` | Login, logout, password hashing helper, and session validation. |
| `server/utils/openinary.js` | Upload helper for image files sent to the configured Openinary-compatible API. |

## API Integration

### Exposed Backend APIs

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Basic server health response. |
| `GET` | `/api/auth/check` | Validates the `appToken` cookie and returns user role/status. |
| `POST` | `/api/auth/alumni/login` | Logs in a user with email/password and sets `appToken`. |
| `POST` | `/api/auth/logout` | Clears the `appToken` cookie. |
| `GET` | `/api/admin/get` | Lists admin profiles. |
| `PATCH` | `/api/admin/update/:id` | Updates an admin profile email/password. |
| `POST` | `/api/admin/add-kya-profile` | Adds a KYA profile with image upload. |
| `GET` | `/api/admin/get-kya-profiles` | Lists KYA profiles. |
| `DELETE` | `/api/admin/delete-kya-profile/:id` | Deletes a KYA profile. |
| `POST` | `/api/admin/add-mentor` | Adds a mentor profile with image upload. |
| `DELETE` | `/api/admin/delete-mentor/:id` | Deletes a mentor profile. |
| `GET` | `/api/mentors/get` | Lists mentor profiles. |
| `POST` | `/api/admin/add-program` | Adds a program/event with image upload. |
| `GET` | `/api/admin/get-programs` | Lists programs/events; supports `type` query filtering. |
| `GET` | `/api/admin/about-eventProgram/:id` | Fetches one program/event by ID. |
| `DELETE` | `/api/admin/delete-program/:id` | Deletes a program/event. |
| `POST` | `/api/admin/add-upcoming-event` | Adds an upcoming event with image upload. |
| `GET` | `/api/admin/get-upcoming-events` | Lists upcoming events. |
| `DELETE` | `/api/admin/delete-upcoming-event/:id` | Deletes an upcoming event. |
| `POST` | `/api/admin/add-newsletter` | Uploads a newsletter PDF to Cloudinary. |
| `GET` | `/api/admin/get-newsletters` | Lists newsletters. |
| `GET` | `/api/admin/latest-newsletter` | Fetches the latest newsletter. |
| `DELETE` | `/api/admin/delete-newsletter/:id` | Deletes a newsletter and its Cloudinary raw file when possible. |
| `POST` | `/api/admin/add-magazine` | Uploads a magazine PDF to Cloudinary. |
| `GET` | `/api/admin/get-magazines` | Lists magazines. |
| `GET` | `/api/admin/latest-magazine` | Fetches the latest magazine. |
| `DELETE` | `/api/admin/delete-magazine/:id` | Deletes a magazine and its Cloudinary raw file when possible. |
| `POST` | `/api/admin/add-yearbook` | Adds a yearbook title and PDF/link URL. |
| `GET` | `/api/admin/get-yearbooks` | Lists yearbooks. |
| `GET` | `/api/admin/latest-yearbook` | Fetches the latest yearbook. |
| `DELETE` | `/api/admin/delete-yearbook/:id` | Deletes a yearbook. |
| `POST` | `/api/gallery` | Adds a gallery photo with image upload. |
| `GET` | `/api/gallery` | Lists gallery photos. |
| `GET` | `/api/gallery/recent` | Lists the latest gallery photos, limited to 8. |
| `DELETE` | `/api/gallery/:id` | Deletes a gallery photo record. |
| `POST` | `/api/cv/addCV` | Creates a CV review submission. |
| `GET` | `/api/cv/getCV` | Lists CV review submissions. |
| `GET` | `/api/alumni-contributions` | Lists public alumni contributions. |
| `POST` | `/api/admin/add-alumni-contribution` | Adds an alumni contribution with photo upload. |
| `GET` | `/api/admin/get-alumni-contributions` | Lists alumni contributions for admin. |
| `DELETE` | `/api/admin/delete-alumni-contribution/:id` | Deletes an alumni contribution. |
| `GET` | `/api/sponsors/sponsors` | Lists sponsors. |
| `POST` | `/api/sponsors/admin/add-sponsor` | Adds a sponsor with logo upload. |
| `DELETE` | `/api/sponsors/admin/delete-sponsor/:id` | Deletes a sponsor. |

Some routers are mounted both directly and through `server/routes/index.js`, so a few endpoints may also be reachable through duplicate `/api/...` paths. The table above reflects the paths used by the main server mounts and active frontend code.

### External APIs and Services

| Service | Used For | Code Location |
| --- | --- | --- |
| MongoDB | Main application database | `server/index.js`, `server/models/*` |
| Cloudinary | Newsletter and magazine PDF storage | `server/config/cloudinary.js`, `server/controllers/admin.controller.js` |
| Openinary-compatible upload API | Image storage for profiles, gallery, sponsors, events, and contributions | `server/utils/openinary.js` |
| Google OAuth Provider | Frontend provider setup | `client/src/main.jsx` |

## Database

The backend uses Mongoose models:

| Model | Main Fields | Purpose |
| --- | --- | --- |
| `Alumni_db` | `alumniName`, `alumniEmail`, `alumniPassword`, `alumniProfilePic`, `authProvider`, `isInstituteEmail`, `status`, `role` | Stores alumni/admin-style login records and role/status metadata. |
| `Admin_db` | `AdminEmail`, `AdminPassword` | Stores admin profile credentials. |
| `Mentorship_db` | `name`, `degree`, `graduationYear`, `about`, `skills`, `linkedinId`, `profilePic` | Stores mentor directory profiles. |
| `KYA_db` | `Name`, `Batch`, `CurrRole`, `Achievement`, `ShortBio`, `LinkedInPostLink`, `profilePic` | Stores KYA alumni profiles. |
| `EventProgram` | `type`, `image`, `title`, `date`, `time`, `venue`, `about`, `attendance` | Stores programs and events. |
| `UpcomingEvent` | `image`, `title`, `date`, `venue` | Stores upcoming event cards. |
| `Newsletter` | `title`, `pdfUrl`, `publicId`, `createdAt` | Stores newsletter PDF metadata. |
| `Magazine` | `title`, `pdfUrl`, `publicId`, `createdAt` | Stores magazine PDF metadata. |
| `Yearbook` | `title`, `pdfUrl`, `publicId`, `createdAt` | Stores yearbook links/PDF metadata. |
| `CV_Review_db` | `Name`, `Roll_No`, `Student_Email`, `CV_link`, `Target_Profile` | Stores CV review requests. |
| `Gallery` | `image`, `createdAt` | Stores gallery image URLs. |
| `Sponsor` | `name`, `type`, `icon` | Stores sponsor records. |
| `AlumniContribution` | `name`, `batch`, `photo` | Stores alumni contributor cards. |

## Authentication

Authentication is implemented with JWTs stored in an HTTP-only cookie named `appToken`.

1. A user submits `alumniEmail` and `password` from the login page.
2. The backend finds the user in `Alumni_db`.
3. bcrypt compares the submitted password with `alumniPassword`.
4. The backend signs a JWT containing the user ID and role.
5. The JWT is stored in `appToken` for seven days.
6. Frontend route guards call `/api/auth/check` and allow admin access only when the returned role is `admin`.

The cookie is currently configured with `secure: false` and `sameSite: "Lax"` in code. For HTTPS production deployments, review cookie security settings before going live.

## Available Scripts

### Root

The root `package.json` does not define scripts.

### Client

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with `--host`. |
| `npm run build` | Builds the frontend into `client/dist`. |
| `npm run lint` | Runs ESLint over the client project. |
| `npm run preview` | Serves the production build locally with Vite preview. |

### Server

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the backend with nodemon. |
| `npm start` | Starts the backend with Node.js. |
| `npm test` | Placeholder script that exits with an error. |

## Screenshots

![Home](docs/images/home.png)

![Admin Dashboard](docs/images/admin-dashboard.png)

![Publications](docs/images/publications.png)

![Mentors](docs/images/mentors.png)

## Contributing

Contributions are welcome. Please keep changes focused and test the affected client or server area before opening a pull request.

1. Fork the repository.
2. Create a feature branch.
3. Install dependencies in the relevant workspace.
4. Make your changes.
5. Run lint/build checks where applicable.
6. Open a pull request with a clear summary and screenshots for UI changes.