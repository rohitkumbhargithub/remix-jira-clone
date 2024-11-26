import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import './tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/button";


export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    
    console.log("Current Path:", location.pathname);
  }, [location]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {/* <ToastContainer /> */}
        <Toaster/>
        <Scripts />
        
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}


export function ErrorBoundary() {
  return (
    <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
    <AlertTriangle className="size-6 text-muted-foreground"/>
    <p className="text-sm text-muted-foreground">
        Something went wrong
    </p>
    <Button variant="outline" size="sm">
        <Link to="/">
            Back to Home
        </Link>
    </Button>
</div>
  )
}