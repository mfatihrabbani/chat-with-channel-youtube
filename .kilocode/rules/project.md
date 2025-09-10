# Project Structure
## Directory Layout

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles with Tailwind and theme variables
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page component
├── components/         # React components
│   ├── chat/           # Chat-related components
│   │   ├── ChannelInput.tsx    # Input for YouTube channel URL
│   │   └── ChatInterface.tsx   # Main chat interface
│   ├── layout/         # Layout components
│   │   └── Header.tsx  # App header/navigation
│   └── ui/             # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
└── lib/                # Utility libraries
├── supabase.ts     # Supabase client configuration
└── utils.ts        # Utility functions
```

## Key Components
1. **ChannelInput**: Component for entering YouTube channel URLs or names
2. **ChatInterface**: Main chat interface that displays messages and handles user input
3. **Header**: Navigation header with app title and navigation links

