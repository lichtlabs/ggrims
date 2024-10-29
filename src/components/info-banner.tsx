"use client"
import { PartyPopper, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Button } from "./ui/button"

export function InfoBanner() {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    isOpen && (
      <div className="fixed w-full">
        <Alert className="relative w-full">
          <PartyPopper className="h-4 w-4" />
          <AlertTitle className="font-semibold">Heads up!</AlertTitle>
          <AlertDescription className="max-w-[320px] sm:max-w-none">
            We're thrilled to announce that we're sponsoring{" "}
            <Link
              href="https://github.com/lichtlabs"
              target="_blank"
              className="underline"
            >
              Licht Labs
            </Link>
            !
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  )
}
