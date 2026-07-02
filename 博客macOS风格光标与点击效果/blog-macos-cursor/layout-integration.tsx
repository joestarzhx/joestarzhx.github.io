// src/app/layout.tsx
import { BlogCursor } from "@/components/effects/BlogCursor";

// Inside <Providers>, preferably after <BrandIntro />:
<Providers>
  <div className="noise" />
  <BrandIntro />
  <BlogCursor />
  <Header />
  {children}
  <Footer />
</Providers>
