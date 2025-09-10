# Development Guidelines
## Code Style
- Use TypeScript for all JavaScript code
- Follow the established component structure with proper TypeScript interfaces
- Use functional components with React hooks
- Implement proper prop typing with TypeScript interfaces

## Styling Approach
- Use Tailwind CSS for styling
- Leverage shadcn/ui components for consistent UI elements
- Follow the established color scheme with CSS variables for light/dark mode support
- Use the established responsive design patterns (grid, flexbox)

## State Management
- Currently using React's built-in state management
- Consider implementing a state management solution (like Zustand or React Query) as the app grows

## API Integration
- Use Supabase for backend services
- Implement proper error handling for API calls
- Makesure not expose error in backend to frontend
- Use environment variables for sensitive configuration (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

## File Organization
- Keep components modular and focused on single responsibilities
- Use the established directory structure for consistency
- Name files using PascalCase for components and camelCase for utilities

## Performance Considerations
- Use Next.js built-in optimizations (image optimization, code splitting)
- Implement proper loading states for async operations
- Consider implementing React.memo for expensive components

## Accessibility
- Ensure all interactive elements are keyboard accessible
- Use proper ARIA attributes where necessary
- Maintain good color contrast ratios

## Security
- Always validate json from frontend