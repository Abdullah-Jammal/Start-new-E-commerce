"use client"

import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonTypes = {
  href : string,
  label : string
}

export default function BackButton({href, label}: BackButtonTypes) {
  return (
      <Button className="mx-auto mt-6">
        <Link href={href} aria-label={label}>
          {label}
        </Link>
      </Button>
  )
}
