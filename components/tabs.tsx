"use client";

import { useState } from "react";
import clsx from "clsx";

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export default function Tabs({ tabs, defaultTabId }: TabsProps) {
  const firstEnabled = tabs.find((tab) => !tab.disabled)?.id ?? tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(defaultTabId ?? firstEnabled);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={clsx(
              "rounded-full px-5 py-2 text-sm font-semibold transition",
              tab.id === activeTab ? "bg-brand-500 text-white" : "border border-slate-700 text-slate-300",
              tab.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tabs.map((tab) => (
          <div key={tab.id} hidden={tab.id !== activeTab}>
            {tab.id === activeTab && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
