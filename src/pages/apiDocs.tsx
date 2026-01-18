import React, { useState } from 'react';
import { Home, Users, Database, Shield, Settings, Image, Code, Lock, Cloud, Layers, FileText, Zap } from 'lucide-react';
import AuthFlow from '../../public/AuthFlow.png';
import ReqFlow from '../../public/ReqFlow.png';
// Image Placeholder Component
const ImagePlaceholder = ({ label, img = "", onClick }) => {
  const hasImage = Boolean(img);

  return (
    <div
      onClick={onClick}
      className={`w-full border-2 border-purple-500/30 rounded-lg cursor-pointer 
      hover:border-purple-400/50 transition-all bg-gradient-to-br from-purple-900/20 to-blue-900/20
      ${hasImage ? "p-3" : "h-64 flex items-center justify-center"}
      `}
    >
      {hasImage ? (
        /* IMAGE + CONTENT STACK */
        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="w-full min-h-[350px] !max-h-[40px] rounded-md overflow-hidden">
            <img
              src={img}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-sm text-gray-300">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Click to view details
            </p>
          </div>
        </div>
      ) : (
        /* CENTERED PLACEHOLDER */
        <div className="text-center group">
          <div className="text-purple-400 mb-2">
            <Image className="w-12 h-12 mx-auto opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-gray-400 group-hover:text-gray-300">
            {label}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Click to view details
          </p>
        </div>
      )}
    </div>
  );
};
// Modal Component
const DetailModal = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-purple-500/30 rounded-lg max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-purple-400 mb-4">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
        <button 
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Introduction Section
const IntroductionSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Home className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">What is FieldStack?</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 text-lg leading-relaxed mb-4">
        FieldStack is a production-ready, self-hosted headless CMS framework inspired by Directus. Built with modern technologies 
        (NestJS, Prisma, PostgreSQL, React), it provides a complete solution for managing dynamic content through an intuitive 
        admin interface and auto-generated REST APIs.
      </p>
      <p className="text-gray-300 text-lg leading-relaxed mb-4">
        Unlike cloud-dependent solutions, FieldStack is fully self-contained, giving you complete control over your data and 
        infrastructure. The system features automatic database bootstrapping, JWT authentication, role-based access control, and 
        a metadata-driven architecture that generates CRUD operations on-the-fly.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Zero Dependencies</h4>
          <p className="text-sm text-gray-400">No external cloud services required. Deploy anywhere.</p>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Auto-Generated APIs</h4>
          <p className="text-sm text-gray-400">REST endpoints created dynamically for each collection.</p>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-400 mb-2">Type-Safe</h4>
          <p className="text-sm text-gray-400">TypeScript + Prisma ensures compile-time safety.</p>
        </div>
      </div>
    </div>
  </section>
);

// Vision Section
const VisionSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Zap className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Vision & Philosophy</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">Developer-First Design</h3>
      <p className="text-gray-300 leading-relaxed mb-6">
        FieldStack embraces a developer-first philosophy. Every decision prioritizes extensibility, clarity, and maintainability. 
        The modular NestJS architecture allows seamless customization without framework lock-in.
      </p>
      
      <h3 className="text-xl font-semibold text-purple-400 mb-4">Core Principles</h3>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Metadata-Driven:</strong> Collections and fields are stored as metadata, enabling runtime schema evolution without migrations.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>API-First:</strong> Frontend and backend are fully decoupled. APIs can be consumed by any client.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Security by Default:</strong> JWT authentication, role-based access, input validation, and SQL injection protection out of the box.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Production-Ready:</strong> Docker containerization, environment-based configuration, health checks, and logging included.</span>
        </li>
      </ul>
    </div>
  </section>
);

// Architecture Section
const ArchitectureSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Layers className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">System Architecture</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        FieldStack follows a three-tier architecture: React frontend (presentation), NestJS backend (business logic), and 
        PostgreSQL database (persistence). Communication happens via RESTful APIs with JWT authentication.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder 
          label="Overall Architecture Diagram" 
          img={AuthFlow}
          onClick={() => onImageClick(
            'System Architecture',
            'The architecture consists of: (1) React frontend at localhost:3000 communicating via HTTP/REST, (2) NestJS backend at localhost:4000 with modules for Auth, Collections, CRUD, Permissions, and Bootstrap, (3) Prisma ORM providing type-safe database access, (4) PostgreSQL database storing both metadata (collections, fields, users, roles) and dynamic content tables.'
          )}
        />
        <ImagePlaceholder 
          label="Request-Response Flow" 
          img={ReqFlow}
          onClick={() => onImageClick(
            'Request Flow',
            'Typical flow: User action → React component → API client (with JWT token) → NestJS controller → Service layer → Prisma ORM → PostgreSQL → Response back through chain. Guards validate tokens, pipes validate DTOs, and error handlers catch exceptions at each layer.'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Key Architectural Decisions</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✓ Monorepo structure with separate frontend/backend directories</li>
          <li>✓ Single PostgreSQL database with metadata + dynamic tables</li>
          <li>✓ Dependency injection via NestJS for testability</li>
          <li>✓ Prisma migrations for version-controlled schema changes</li>
          <li>✓ Environment-based configuration (.env files)</li>
        </ul>
      </div>
    </div>
  </section>
);

// Authentication Section
const AuthenticationSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Lock className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Authentication & Authorization</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        FieldStack implements JWT-based authentication with access tokens (15min) and refresh tokens (7 days). Passwords are 
        hashed using bcrypt with 12 salt rounds. Role-based access control (RBAC) enforces permissions at both the API and UI levels.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ImagePlaceholder 
          label="Login Page" 
          onClick={() => onImageClick(
            'Login Interface',
            'Clean login form with email/password inputs. Shows default credentials for testing (admin@fieldstack.local). Validates inputs client-side before sending to /auth/login endpoint. Stores JWT tokens in localStorage and redirects to dashboard on success.'
          )}
        />
        <ImagePlaceholder 
          label="Signup Page (Disabled)" 
          onClick={() => onImageClick(
            'User Registration',
            'Public signup is disabled by default for security. New users must be created by administrators through the User Management interface. This prevents unauthorized account creation and ensures proper role assignment.'
          )}
        />
        <ImagePlaceholder 
          label="Authentication Flow Diagram" 
          onClick={() => onImageClick(
            'Auth Flow',
            'Login → Credentials sent to backend → Password verified with bcrypt → JWT tokens generated → Tokens returned to frontend → Stored in memory/localStorage → Subsequent requests include Bearer token in Authorization header → Backend validates token signature and expiry → User context extracted from payload.'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Security Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
          <div>
            <p className="font-medium text-purple-300 mb-2">Token Management</p>
            <ul className="space-y-1">
              <li>• Access token: 15 minutes (configurable)</li>
              <li>• Refresh token: 7 days (configurable)</li>
              <li>• Automatic expiry validation</li>
              <li>• Secure JWT signing with secret</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-purple-300 mb-2">Password Security</p>
            <ul className="space-y-1">
              <li>• Bcrypt hashing (12 rounds)</li>
              <li>• No plain-text storage</li>
              <li>• Configurable salt rounds</li>
              <li>• Password strength validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Dashboard Section
const DashboardSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Home className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The dashboard provides a centralized view of system status, recent activity, and quick access to common tasks. Built with 
        React and shadcn/ui components, it offers a modern, responsive interface.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePlaceholder 
          label="Dashboard Main View" 
          onClick={() => onImageClick(
            'Dashboard Overview',
            'Main dashboard displays: (1) System statistics cards (total collections, users, recent activity), (2) Quick action buttons for creating collections/users, (3) Recent content updates timeline, (4) System health indicators. Sidebar navigation provides access to all modules.'
          )}
        />
        <ImagePlaceholder 
          label="Dashboard Navigation" 
          onClick={() => onImageClick(
            'Navigation Structure',
            'Sidebar includes: Dashboard (home), Collections, Content Management, Users, Roles & Permissions, Media Library, API Explorer, Site Settings, My Account. Icons from Lucide React. Active route highlighted with purple accent. Collapsible on mobile.'
          )}
        />
      </div>
    </div>
  </section>
);

// Site Settings Section
const SiteSettingsSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Settings className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Site Settings</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Global site configuration managed through a centralized settings panel. All changes propagate across the application 
        in real-time, affecting both the admin interface and public-facing APIs.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePlaceholder 
          label="Site Settings Page" 
          onClick={() => onImageClick(
            'Settings Interface',
            'Form-based settings page with sections: (1) Site Information (name, title, description, URL), (2) Contact Details (email, phone), (3) Branding (logo and favicon uploads with preview), (4) Social Links (JSON editor), (5) Additional Metadata. Save/Reset buttons at bottom.'
          )}
        />
        <ImagePlaceholder 
          label="Branding Preview" 
          onClick={() => onImageClick(
            'Branding System',
            'Logo and favicon can be uploaded via file input. Previews shown in real-time. Files stored in /uploads/files/ directory and referenced by ID in site_info table. Changes reflect immediately in navigation bar and browser tab.'
          )}
        />
      </div>
    </div>
  </section>
);

// User Management Section
const UserManagementSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Users className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">User Management</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Complete user lifecycle management: create, read, update, delete (CRUD) operations with role assignment. Users table 
        stores authentication data while profiles table holds metadata like display names and avatars.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePlaceholder 
          label="Users List View" 
          onClick={() => onImageClick(
            'Users Table',
            'Paginated table showing: Email, Display Name, Roles, Status, Created Date. Actions: Edit, Delete, Reset Password. Search and filter capabilities. Bulk actions for multiple users. Export to CSV option.'
          )}
        />
        <ImagePlaceholder 
          label="User Edit Modal" 
          onClick={() => onImageClick(
            'Edit User',
            'Modal form for editing user details: Email (unique), Display Name, Avatar Upload, Role Assignment (checkboxes for ADMIN/EDITOR/VIEWER/CUSTOM), Status toggle (active/inactive). Password reset option sends email or shows temporary password.'
          )}
        />
      </div>
    </div>
  </section>
);

// Role Management Section
const RoleManagementSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Shield className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Role & Permission Management</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Granular permission system allowing fine-tuned access control. Permissions are defined per collection and action 
        (READ, CREATE, UPDATE, DELETE), with support for custom conditional rules stored as JSON.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder 
          label="Roles List" 
          onClick={() => onImageClick(
            'Roles Overview',
            'Table of roles: ADMIN (all permissions), EDITOR (read/create/update), VIEWER (read-only), CUSTOM (define per user). Each role shows user count and last modified date. Click to edit permissions matrix.'
          )}
        />
        <ImagePlaceholder 
          label="Role Permissions Matrix" 
          onClick={() => onImageClick(
            'Permissions Grid',
            'Grid with collections as rows and actions (READ/CREATE/UPDATE/DELETE) as columns. Checkboxes toggle permissions. Additional fields for conditional rules (e.g., "own records only"). Changes saved per collection or bulk-applied.'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Default Roles</h4>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">ADMIN</span>
            <span>Full system access. Can manage users, roles, collections, and all content.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">EDITOR</span>
            <span>Can read, create, and update content but cannot delete or manage system settings.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">VIEWER</span>
            <span>Read-only access to content. Cannot modify any data.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-purple-400">CUSTOM</span>
            <span>Flexible role with permissions defined per user or group.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Collections Section
const CollectionsSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Database className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Collections System</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Collections are the core abstraction in FieldStack. Each collection represents a content type (e.g., "Posts", "Products") 
        and maps to a database table. Metadata about the collection and its fields is stored separately, enabling dynamic schema evolution.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder 
          label="Collections List" 
          onClick={() => onImageClick(
            'Collections Overview',
            'Cards or table showing all collections with: Name, Display Name, Table Name, Field Count, Record Count, Status (active/archived), Created Date. Click to view/edit collection details or manage content.'
          )}
        />
        <ImagePlaceholder 
          label="Collection Details" 
          onClick={() => onImageClick(
            'Collection Schema',
            'Detailed view of a collection showing: Basic info (name, description, icon), Fields list (name, type, required, default value), Relationships to other collections, Permissions matrix, API endpoint reference.'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Collection Metadata</h4>
        <p className="text-gray-300 text-sm mb-3">Each collection stores:</p>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li><span className="text-purple-400">•</span> <strong>Name:</strong> Unique identifier (e.g., "posts")</li>
          <li><span className="text-purple-400">•</span> <strong>Display Name:</strong> Human-readable label (e.g., "Blog Posts")</li>
          <li><span className="text-purple-400">•</span> <strong>Table Name:</strong> Physical database table (e.g., "posts_collection")</li>
          <li><span className="text-purple-400">•</span> <strong>Fields:</strong> Array of field definitions with types, validations, UI components</li>
          <li><span className="text-purple-400">•</span> <strong>Status:</strong> ACTIVE or ARCHIVED</li>
        </ul>
      </div>
    </div>
  </section>
);

// Collection Builder Section
const CollectionBuilderSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <FileText className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Collection Builder</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        The Collection Builder provides a visual interface for defining content schemas without writing code. Add fields, 
        configure validations, set up relationships, and the system automatically generates database tables and API endpoints.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImagePlaceholder 
          label="Collection Builder Main" 
          onClick={() => onImageClick(
            'Builder Interface',
            'Split-screen layout: Left side shows field list (draggable for reordering), right side shows selected field configuration. Bottom panel displays SQL preview of table schema. Save button triggers migration.'
          )}
        />
        <ImagePlaceholder 
          label="Add Field Modal" 
          onClick={() => onImageClick(
            'Field Creation',
            'Modal for adding new field: Field Name (auto-generates dbColumn), Display Label, Field Type (dropdown: TEXT, NUMBER, BOOLEAN, DATETIME, FILE, RELATION), Required toggle, Default Value, Validation Rules, UI Component selection.'
          )}
        />
        <ImagePlaceholder 
          label="Field Configuration" 
          onClick={() => onImageClick(
            'Field Settings',
            'Detailed configuration panel: Basic settings (name, type, required), Validation rules (min/max length, regex patterns), UI settings (placeholder, help text, component type), Relationship settings (for relation fields: target collection, display field), File settings (accepted types, max size).'
          )}
        />
      </div>

      <div className="mt-6 bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Supported Field Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 text-sm">
          <div><span className="text-purple-400">TEXT:</span> Single-line or multi-line text</div>
          <div><span className="text-purple-400">NUMBER:</span> Integer or decimal values</div>
          <div><span className="text-purple-400">BOOLEAN:</span> True/false toggle or checkbox</div>
          <div><span className="text-purple-400">DATETIME:</span> Date, time, or datetime picker</div>
          <div><span className="text-purple-400">FILE:</span> File upload with type restrictions</div>
          <div><span className="text-purple-400">RELATION:</span> Foreign key to another collection</div>
        </div>
      </div>
    </div>
  </section>
);

// Media Library Section
const MediaLibrarySection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Image className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Media Library & File Manager</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Centralized file management system for all uploads. Files are stored in /uploads/files/ directory with metadata tracked 
        in the database. Supports single/multiple uploads, previews, metadata editing, and URL generation for use in content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ImagePlaceholder 
          label="Media Library Grid" 
          onClick={() => onImageClick(
            'File Grid View',
            'Grid of uploaded files showing thumbnails (for images) or file type icons. Hover shows quick actions: View, Copy URL, Delete. Click opens detail panel. Search, filter by type/date, and bulk select options.'
          )}
        />
        <ImagePlaceholder 
          label="File Preview" 
          onClick={() => onImageClick(
            'File Viewer',
            'Modal for previewing files: Images shown at full size, videos have inline player, documents show first page. Metadata displayed below: filename, size, type, upload date, URL. Options to download or delete.'
          )}
        />
        <ImagePlaceholder 
          label="File Details Panel" 
          onClick={() => onImageClick(
            'File Metadata',
            'Sidebar panel showing: Original filename, File size (formatted), MIME type, Upload date/time, Public URL (copy button), References (list of content using this file), Edit metadata button (rename, add description).'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">File Upload Features</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✓ Drag-and-drop upload interface</li>
          <li>✓ Multiple file selection (up to 100MB per file, configurable)</li>
          <li>✓ Automatic UUID generation for unique filenames</li>
          <li>✓ MIME type validation</li>
          <li>✓ Thumbnail generation for images</li>
          <li>✓ One-click URL copy to clipboard</li>
          <li>✓ Pagination for large libraries</li>
        </ul>
      </div>
    </div>
  </section>
);

// API Layer Section
const APILayerSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Code className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">API Layer</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        FieldStack auto-generates RESTful API endpoints for each collection. All endpoints require JWT authentication 
        (except /auth/login) and enforce role-based permissions. Supports pagination, filtering, and sorting out of the box.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ImagePlaceholder 
          label="API Listing Page" 
          onClick={() => onImageClick(
            'API Explorer',
            'Interactive API documentation page listing all available endpoints grouped by collection. Each endpoint shows: Method (GET/POST/PATCH/DELETE), Path, Required auth, Expected parameters, Sample response. Try-it-now feature with auth token input.'
          )}
        />
        <ImagePlaceholder 
          label="API Endpoint Details" 
          onClick={() => onImageClick(
            'Endpoint Documentation',
            'Detailed view of specific endpoint: Description, Authentication requirements, Request headers, Request body schema (with field types), Response schema, Status codes, Example cURL command, JavaScript fetch example.'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Standard Endpoints (per collection)</h4>
        <div className="space-y-3 text-gray-300 text-sm font-mono">
          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="text-green-400">GET</span>
            <span>/api/:collection</span>
            <span className="text-gray-500">List records (paginated)</span>
          </div>
          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="text-yellow-400">POST</span>
            <span>/api/:collection</span>
            <span className="text-gray-500">Create record</span>
          </div>
          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="text-green-400">GET</span>
            <span>/api/:collection/:id</span>
            <span className="text-gray-500">Get single record</span>
          </div>
          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="text-blue-400">PATCH</span>
            <span>/api/:collection/:id</span>
            <span className="text-gray-500">Update record</span>
          </div>
          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="text-red-400">DELETE</span>
            <span>/api/:collection/:id</span>
            <span className="text-gray-500">Delete record</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// API Examples Section
const APIExamplesSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Code className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">API Examples</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Login Request</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`POST /auth/login
Content-Type: application/json

{
  "email": "admin@fieldstack.local",
  "password": "fieldstack@Admin123!"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@fieldstack.local",
    "roles": ["ADMIN"]
  }
}`}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">List Records (Paginated)</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`GET /api/posts?page=1&limit=25
Authorization: Bearer {accessToken}

// Response
{
  "collection": "posts",
  "data": [
    {
      "id": "uuid-1",
      "title": "First Post",
      "content": "Post content...",
      "status": "published",
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": "2026-01-18T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 245,
    "totalPages": 10
  }
}`}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Create Record</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`POST /api/posts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "New Post",
  "content": "Post content here...",
  "status": "draft"
}

// Response
{
  "id": "uuid-new",
  "title": "New Post",
  "content": "Post content here...",
  "status": "draft",
  "createdAt": "2026-01-18T12:00:00Z",
  "updatedAt": "2026-01-18T12:00:00Z"
}`}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">Update Record</h4>
          <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`PATCH /api/posts/uuid-1
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "published"
}

// Response
{
  "id": "uuid-1",
  "title": "First Post",
  "content": "Post content...",
  "status": "published",
  "updatedAt": "2026-01-18T13:00:00Z"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// My Account Section
const MyAccountSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Users className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">My Account</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Personalized account management page where users can update their profile information, change passwords, 
        and manage personal preferences.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        <ImagePlaceholder 
          label="My Account Page" 
          onClick={() => onImageClick(
            'Account Settings',
            'Profile section with: Avatar upload (with preview), Display name input, Email (read-only, requires admin to change), Password change form (current + new password with strength indicator), Personal preferences (timezone, language, theme), Two-factor authentication toggle (future feature).'
          )}
        />
      </div>
    </div>
  </section>
);

// Security Section
const SecuritySection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Shield className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Security Model</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Multi-layered security approach protecting against common vulnerabilities while maintaining developer productivity.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Authentication Layer</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ JWT-based stateless authentication</li>
            <li>✓ Bcrypt password hashing (12 rounds)</li>
            <li>✓ Token expiry and refresh mechanism</li>
            <li>✓ Secure token storage (memory + httpOnly cookies option)</li>
          </ul>
        </div>
        
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Authorization Layer</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ Role-based access control (RBAC)</li>
            <li>✓ Permission matrix per collection</li>
            <li>✓ Conditional access rules (JSON-based)</li>
            <li>✓ Middleware enforcement on all routes</li>
          </ul>
        </div>

        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Input Validation</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ DTO validation with class-validator</li>
            <li>✓ Schema validation at API layer</li>
            <li>✓ Type coercion and sanitization</li>
            <li>✓ SQL injection prevention via Prisma ORM</li>
          </ul>
        </div>

        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
          <h4 className="font-semibold text-purple-400 mb-3">Data Protection</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ Environment-based secrets (.env)</li>
            <li>✓ CORS configuration</li>
            <li>✓ Rate limiting (planned)</li>
            <li>✓ HTTPS enforcement (production)</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// Deployment Section
const DeploymentSection = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Cloud className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Deployment Strategy</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        FieldStack supports single-domain deployment where both frontend and backend are served from the same domain. 
        Backend APIs are accessible at /api prefix while frontend routes handle all other paths.
      </p>
      
      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-purple-400 mb-3">Environment Configuration</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-purple-300 mb-2">Development</p>
            <div className="bg-black/30 rounded p-3 font-mono text-xs text-gray-300">
              Frontend: http://localhost:8080<br/>
              Backend: http://localhost:4000/api
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-300 mb-2">Production</p>
            <div className="bg-black/30 rounded p-3 font-mono text-xs text-gray-300">
              Frontend: https://yourdomain.com<br/>
              Backend: https://yourdomain.com/api
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Build Pipeline</h4>
        <ol className="space-y-2 text-gray-300 text-sm list-decimal list-inside">
          <li>Backend: NestJS compiled to dist/ directory (TypeScript → JavaScript)</li>
          <li>Frontend: Vite builds static assets to dist/ directory</li>
          <li>Docker multi-stage build creates optimized container image</li>
          <li>Environment variables injected at runtime</li>
          <li>Database migrations run automatically on startup</li>
          <li>Health checks ensure services are ready</li>
        </ol>
      </div>
    </div>
  </section>
);

// Blueprint Section
const BlueprintSection = ({ onImageClick }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <Zap className="w-8 h-8 text-purple-400" />
      <h2 className="text-3xl font-bold text-white">Platform Blueprint</h2>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
      <p className="text-gray-300 leading-relaxed mb-6">
        Future roadmap and architectural plans for scaling FieldStack into a comprehensive platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ImagePlaceholder 
          label="Future Architecture" 
          onClick={() => onImageClick(
            'Evolution Plan',
            'Planned architecture: (1) Add GraphQL layer alongside REST APIs, (2) Implement WebSocket support for real-time updates, (3) Introduce microservices for file processing and search, (4) Add Redis for caching and session management, (5) Create plugin system for extensibility.'
          )}
        />
        <ImagePlaceholder 
          label="Scaling Strategy" 
          onClick={() => onImageClick(
            'Horizontal Scaling',
            'Scaling approach: (1) Load balancer (Nginx) distributing traffic across multiple NestJS instances, (2) PostgreSQL read replicas for query distribution, (3) Redis cluster for distributed caching, (4) CDN for static assets, (5) Kubernetes orchestration for container management.'
          )}
        />
        <ImagePlaceholder 
          label="Plugin System" 
          onClick={() => onImageClick(
            'Extensibility Model',
            'Plugin architecture: (1) NPM-based plugins with standardized API, (2) Hooks system for lifecycle events (before/after CRUD operations), (3) Custom field types registration, (4) UI components injection, (5) Admin panel extensions, (6) Webhook system for external integrations.'
          )}
        />
      </div>

      <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
        <h4 className="font-semibold text-purple-400 mb-3">Planned Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
          <div>
            <p className="font-semibold text-purple-300 mb-2">Phase 2 (Q2 2026)</p>
            <ul className="space-y-1">
              <li>• GraphQL API layer</li>
              <li>• Full-text search (Elasticsearch)</li>
              <li>• Webhook system</li>
              <li>• Email notifications</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-purple-300 mb-2">Phase 3 (Q3 2026)</p>
            <ul className="space-y-1">
              <li>• Plugin marketplace</li>
              <li>• Two-factor authentication</li>
              <li>• Audit logging</li>
              <li>• Multi-language support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main Component
export default function ProjectDocumentation() {
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '' });

  const handleImageClick = (title, description) => {
    setModalData({ isOpen: true, title, description });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            FieldStack
          </h1>
          <p className="text-xl text-gray-400 mb-2">Production-Ready Backend Framework Dashboard</p>
          <p className="text-gray-500">Complete A–Z Platform Documentation</p>
          <button
            onClick={() => window.open('https://fieldstack.onrender.com/', '_blank')}
            className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            View Demo Live Project
          </button>
        </div>

        {/* Table of Contents */}
<div className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-10 mb-16">
  <h3 className="text-2xl font-bold text-purple-400 mb-8 tracking-wide">
    Table of Contents
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {[
      ["intro", "Introduction"],
      ["vision", "Vision & Philosophy"],
      ["architecture", "System Architecture"],
      ["auth", "Authentication"],
      ["dashboard", "Dashboard"],
      ["settings", "Site Settings"],
      ["users", "User Management"],
      ["roles", "Roles & Permissions"],
      ["collections", "Collections"],
      ["builder", "Collection Builder"],
      ["media", "Media Library"],
      ["api", "API Layer"],
      ["examples", "API Examples"],
      ["account", "My Account"],
      ["security", "Security"],
      ["deployment", "Deployment"],
      ["blueprint", "Blueprint"],
    ].map(([id, label], index) => (
      <a
        key={id}
        href={`#${id}`}
        className="group flex items-center gap-4 rounded-xl border border-purple-500/10 
                   bg-gray-950/40 px-5 py-4 transition-all
                   hover:border-purple-400/40 hover:bg-purple-900/10"
      >
        {/* Number Badge */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full 
                     bg-purple-500/10 text-sm font-semibold text-purple-400
                     group-hover:bg-purple-500/20"
        >
          {index + 1}
        </div>

        {/* Label */}
        <div className="text-gray-300 group-hover:text-purple-300 transition-colors">
          {label}
        </div>
      </a>
    ))}
  </div>
</div>


        {/* Sections */}
        <div id="intro"><IntroductionSection /></div>
        <div id="vision"><VisionSection /></div>
        <div id="architecture"><ArchitectureSection onImageClick={handleImageClick} /></div>
        <div id="auth"><AuthenticationSection onImageClick={handleImageClick} /></div>
        <div id="dashboard"><DashboardSection onImageClick={handleImageClick} /></div>
        <div id="settings"><SiteSettingsSection onImageClick={handleImageClick} /></div>
        <div id="users"><UserManagementSection onImageClick={handleImageClick} /></div>
        <div id="roles"><RoleManagementSection onImageClick={handleImageClick} /></div>
        <div id="collections"><CollectionsSection onImageClick={handleImageClick} /></div>
        <div id="builder"><CollectionBuilderSection onImageClick={handleImageClick} /></div>
        <div id="media"><MediaLibrarySection onImageClick={handleImageClick} /></div>
        <div id="api"><APILayerSection onImageClick={handleImageClick} /></div>
        <div id="examples"><APIExamplesSection /></div>
        <div id="account"><MyAccountSection onImageClick={handleImageClick} /></div>
        <div id="security"><SecuritySection /></div>
        <div id="deployment"><DeploymentSection /></div>
        <div id="blueprint"><BlueprintSection onImageClick={handleImageClick} /></div>

        {/* Footer */}
        <div className="text-center pt-16 pb-8 border-t border-purple-500/20">
          <p className="text-gray-400 mb-2">FieldStack Documentation</p>
          <p className="text-sm text-gray-600">
            Built with NestJS, Prisma, PostgreSQL, React • Version 2.0.0 • January 2026
          </p>
        </div>
      </div>

      {/* Modal */}
      <DetailModal 
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        description={modalData.description}
      />
    </div>
  );
}