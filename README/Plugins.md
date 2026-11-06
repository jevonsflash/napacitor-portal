---
title: Napacitor APIs
description: Official Napacitor plugin APIs
sidebar_label: APIs
slug: /apis
---

# Napacitor APIs

The official Napacitor plugins wrap .NET MAUI native APIs with a consistent, promise-based JavaScript interface. Each plugin is an npm package under the `@napacitor/*` scope with a C# `[NapacitorPlugin]` implementation that runs unchanged on Android, iOS, macOS, and Windows.

| Plugin | Description |
| --- | --- |
| [Action Sheet](/apis/action-sheet.md) | Native action sheets from the bottom of the screen (`Page.DisplayActionSheet`). |
| [App](/apis/app.md) | High-level app state and events: lifecycle, deep links, language, exiting. |
| [App Actions](/apis/app-actions.md) | Quick actions on the app icon (Android App Shortcuts, iOS Quick Actions, Windows jump lists). |
| [App Info](/apis/app-info.md) | General information about the app (`AppInfo`, `VersionTracking`). |
| [App Launcher](/apis/app-launcher.md) | Open other apps, URLs, and maps (`Launcher`, `Map`). |
| [Battery](/apis/battery.md) | Battery level and charging state (`Battery` Essentials API). |
| [Browser](/apis/browser.md) | In-app browser sessions (Android Custom Tabs, iOS SFSafariViewController). |
| [Camera](/apis/camera.md) | Take photos, record videos, and pick media from the library (`MediaPicker`). |
| [Clipboard](/apis/clipboard.md) | Copy to and paste from the system clipboard. |
| [Connectivity](/apis/connectivity.md) | Network state and connectivity change events. |
| [Contacts](/apis/contacts.md) | Read all contacts and pick a contact with the system picker (`Contacts`). |
| [Device](/apis/device.md) | Device model, platform, OS version, language, and locale. |
| [Dialog](/apis/dialog.md) | Native dialogs for alerts, confirmations, and prompts. |
| [Email](/apis/email.md) | Open the system mail composer. |
| [File Viewer](/apis/file-viewer.md) | Open files with the system viewer. |
| [Filesystem](/apis/filesystem.md) | App directories, bundled files, and the system file picker (`FileSystem`, `FilePicker`). |
| [Flashlight](/apis/flashlight.md) | Control the device's flashlight (torch). |
| [Geolocation](/apis/geolocation.md) | Get and track the device's position with GPS. |
| [Haptics](/apis/haptics.md) | Haptic and vibration feedback. |
| [Motion](/apis/motion.md) | Accelerometer, gyroscope, magnetometer, compass, and barometer sensors. |
| [Phone Dialer](/apis/phone-dialer.md) | Open the system dialer to place a call. |
| [Preferences](/apis/preferences.md) | Simple key/value persistent store for lightweight data. |
| [Share](/apis/share.md) | Share content with the system share sheet. |
| [SMS](/apis/sms.md) | Open the system SMS composer. |

:::info
Don't see what you need? Build your own plugin — one C# class marked `[NapacitorPlugin]` plus a TypeScript API definition. Start with the [Creating Plugins](/plugins/creating-plugins/overview.md) guide or the [plugin tutorial](/plugins/tutorial/introduction).
:::
