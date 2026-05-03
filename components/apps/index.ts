"use client";

import { registerApp } from "@/lib/os/app-registry";
import {
  FilesIcon,
  TerminalIcon,
  BrowserIcon,
  SettingsIcon,
  CodeIcon,
  CalculatorIcon,
  CalendarIcon,
  NotesIcon,
  PhotosIcon,
  MusicIcon,
  ClockIcon,
  WeatherIcon,
  AppCenterIcon,
  TextEditorIcon,
  TasksIcon,
  MailIcon,
  VideoIcon,
  CameraIcon,
  MonitorIcon,
} from "@/components/os/AppIcons";

// Import app components
import FilesApp from "./FilesApp";
import TerminalApp from "./TerminalApp";
import SettingsApp from "./SettingsApp";
import CalculatorApp from "./CalculatorApp";
import CalendarApp from "./CalendarApp";
import NotesApp from "./NotesApp";
import TextEditorApp from "./TextEditorApp";
import ClockApp from "./ClockApp";
import BrowserApp from "./BrowserApp";
import PhotosApp from "./PhotosApp";
import MusicApp from "./MusicApp";
import WeatherApp from "./WeatherApp";
import AppCenterApp from "./AppCenterApp";
import TasksApp from "./TasksApp";

// Register all built-in apps
registerApp({
  id: "files",
  name: "Files",
  description: "Browse and manage your files and folders",
  icon: FilesIcon,
  component: FilesApp,
  defaultWidth: 900,
  defaultHeight: 600,
  minWidth: 600,
  minHeight: 400,
  category: "utilities",
  isSystem: true,
  singleInstance: true,
  permissions: ["filesystem.read", "filesystem.write"],
});

registerApp({
  id: "terminal",
  name: "Terminal",
  description: "Command line interface with 30+ commands",
  icon: TerminalIcon,
  component: TerminalApp,
  defaultWidth: 800,
  defaultHeight: 500,
  minWidth: 500,
  minHeight: 300,
  category: "development",
  isSystem: true,
  singleInstance: false,
  permissions: ["filesystem.read", "filesystem.write"],
});

registerApp({
  id: "settings",
  name: "Settings",
  description: "Configure your system preferences",
  icon: SettingsIcon,
  component: SettingsApp,
  defaultWidth: 900,
  defaultHeight: 620,
  minWidth: 700,
  minHeight: 500,
  category: "system",
  isSystem: true,
  singleInstance: true,
  permissions: ["storage"],
});

registerApp({
  id: "calculator",
  name: "Calculator",
  description: "Perform calculations",
  icon: CalculatorIcon,
  component: CalculatorApp,
  defaultWidth: 320,
  defaultHeight: 480,
  minWidth: 280,
  minHeight: 400,
  category: "utilities",
  isSystem: true,
  singleInstance: true,
  permissions: [],
});

registerApp({
  id: "calendar",
  name: "Calendar",
  description: "Manage your schedule and events",
  icon: CalendarIcon,
  component: CalendarApp,
  defaultWidth: 900,
  defaultHeight: 600,
  minWidth: 600,
  minHeight: 450,
  category: "productivity",
  isSystem: true,
  singleInstance: true,
  permissions: ["storage"],
});

registerApp({
  id: "notes",
  name: "Notes",
  description: "Take and organize notes",
  icon: NotesIcon,
  component: NotesApp,
  defaultWidth: 700,
  defaultHeight: 500,
  minWidth: 400,
  minHeight: 350,
  category: "productivity",
  isSystem: true,
  singleInstance: true,
  permissions: ["filesystem.read", "filesystem.write"],
});

registerApp({
  id: "code",
  name: "Text Editor",
  description: "Edit text and code files",
  icon: TextEditorIcon,
  component: TextEditorApp,
  defaultWidth: 900,
  defaultHeight: 600,
  minWidth: 600,
  minHeight: 400,
  category: "development",
  isSystem: true,
  singleInstance: false,
  permissions: ["filesystem.read", "filesystem.write"],
});

registerApp({
  id: "clock",
  name: "Clock",
  description: "World clock, alarms, and timers",
  icon: ClockIcon,
  component: ClockApp,
  defaultWidth: 400,
  defaultHeight: 500,
  minWidth: 350,
  minHeight: 400,
  category: "utilities",
  isSystem: true,
  singleInstance: true,
  permissions: ["notifications"],
});

registerApp({
  id: "browser",
  name: "Browser",
  description: "Browse the web",
  icon: BrowserIcon,
  component: BrowserApp,
  defaultWidth: 1000,
  defaultHeight: 700,
  minWidth: 600,
  minHeight: 400,
  category: "productivity",
  isSystem: true,
  singleInstance: false,
  permissions: ["network"],
});

registerApp({
  id: "photos",
  name: "Photos",
  description: "View and organize your photos",
  icon: PhotosIcon,
  component: PhotosApp,
  defaultWidth: 900,
  defaultHeight: 600,
  minWidth: 600,
  minHeight: 400,
  category: "media",
  isSystem: true,
  singleInstance: true,
  permissions: ["filesystem.read"],
});

registerApp({
  id: "music",
  name: "Music",
  description: "Play your music collection",
  icon: MusicIcon,
  component: MusicApp,
  defaultWidth: 900,
  defaultHeight: 560,
  minWidth: 600,
  minHeight: 400,
  category: "media",
  isSystem: true,
  singleInstance: true,
  permissions: ["filesystem.read"],
});

registerApp({
  id: "weather",
  name: "Weather",
  description: "Check the weather forecast",
  icon: WeatherIcon,
  component: WeatherApp,
  defaultWidth: 400,
  defaultHeight: 500,
  minWidth: 350,
  minHeight: 400,
  category: "utilities",
  isSystem: true,
  singleInstance: true,
  permissions: ["network"],
});

registerApp({
  id: "appcenter",
  name: "App Center",
  description: "Discover and install community apps",
  icon: AppCenterIcon,
  component: AppCenterApp,
  defaultWidth: 900,
  defaultHeight: 650,
  minWidth: 700,
  minHeight: 500,
  category: "system",
  isSystem: true,
  singleInstance: true,
  permissions: ["network", "filesystem.write"],
});

registerApp({
  id: "tasks",
  name: "Tasks",
  description: "Manage your to-do list",
  icon: TasksIcon,
  component: TasksApp,
  defaultWidth: 500,
  defaultHeight: 600,
  minWidth: 350,
  minHeight: 400,
  category: "productivity",
  isSystem: true,
  singleInstance: true,
  permissions: ["storage"],
});

export {
  FilesApp,
  TerminalApp,
  SettingsApp,
  CalculatorApp,
  CalendarApp,
  NotesApp,
  TextEditorApp,
  ClockApp,
  BrowserApp,
  PhotosApp,
  MusicApp,
  WeatherApp,
  AppCenterApp,
  TasksApp,
};
