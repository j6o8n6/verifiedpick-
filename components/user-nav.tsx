"use client";

import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export function UserNav({ session }: { session: Session | null }) {
  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
      >
        Sign in
      </button>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          <span>{session.user?.name ?? "Account"}</span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/dashboard"
                  className={`${active ? "bg-gray-50" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                >
                  Dashboard
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={`${active ? "bg-gray-50" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
