'use client';

import { ReceiptRussianRuble } from "lucide-react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
'next-themes';

export function ThemeProvider({ children, ...props}) {
  return <NextThemeProvider {...props}>{children}

  </NextThemeProvider>
}