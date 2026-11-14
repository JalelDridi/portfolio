"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Door, DoorFrame, Plaque } from "./motifs";

/**
 * The big blue door in the hero. It stands ajar on a short teaser whose
 * "Step inside" link sits above the button; the button opens both leaves and
 * shows the room with two links. Those two only exist while the door is open,
 * so a half-open room hides nothing from the keyboard or a screen reader.
 */
export function HeroDoor() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-auto mt-[3.6rem] w-full max-w-[450px] px-[10px] min-[920px]:mt-0">
      <div className="absolute -top-[3.4rem] left-1/2 z-[3] -translate-x-1/2">
        <Plaque arabic="بنزرت" latin="BIZERTE · TUNISIE" />
      </div>
      <DoorFrame>
        <Door motif="star" paint="blue" state={open ? "open" : "ajar"}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="hero-room"
            aria-label={open ? "Close the door" : "Open the door"}
            onClick={() => setOpen((value) => !value)}
            className="absolute inset-0 z-[3] cursor-pointer"
          />
          <div
            id="hero-room"
            className="focus-sun absolute inset-0 flex items-center overflow-hidden bg-[radial-gradient(120%_60%_at_70%_40%,#1b2a3c,#0c1520_70%)] text-[#eef2f5]"
          >
            <div
              className={cn(
                "relative",
                open
                  ? "z-[4] ml-[17%] w-[66%]"
                  : "pointer-events-none ml-[51%] w-[33%] min-[480px]:ml-[53%] min-[480px]:w-[30%]",
              )}
            >
              <p className="flex items-center gap-1.5 font-mono text-[0.72rem] tracking-[0.12em] text-sun uppercase">
                <span
                  aria-hidden="true"
                  className="inline-block size-2 rounded-full bg-[#5fd08f]"
                />
                Now
              </p>
              <p className="my-2 font-display text-[1.55rem] leading-none font-black tracking-[-0.03em]">
                Solved
                <wbr />
                blue
              </p>
              <p className="mb-[0.9rem] text-[0.82rem] text-[#b8c3ce] min-[480px]:text-[0.9rem]">
                iMessage for business.
              </p>
              {open ? (
                <ul className="flex flex-col items-start gap-3 font-mono text-[0.78rem] text-white">
                  <li>
                    <Link
                      href="/work/solvedblue"
                      className="border-b-2 border-sun hover:text-sun"
                    >
                      Read the case study <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#playground"
                      className="border-b-2 border-sun hover:text-sun"
                    >
                      Break my pipeline <span aria-hidden="true">↓</span>
                    </a>
                  </li>
                </ul>
              ) : (
                // A real link above the button, so it works without JavaScript;
                // its padding makes it a 24 px target.
                <Link
                  href="/work/solvedblue"
                  className="pointer-events-auto relative z-[4] inline-block py-[7px] font-mono text-[0.66rem] leading-none whitespace-nowrap text-white underline decoration-sun decoration-2 underline-offset-[5px] hover:text-sun min-[480px]:text-[0.78rem]"
                >
                  Step inside <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </Door>
      </DoorFrame>
    </div>
  );
}
