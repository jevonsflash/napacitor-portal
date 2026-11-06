---
title: Napacitor CLI
description: Napacitor CLI Documentation
---

# Napacitor CLI

The Napacitor CLI (`@napacitor/cli`) is the command-line tool for creating, building, and managing Napacitor apps. The native platform is a single .NET MAUI Blazor host project, so instead of per-platform commands (`add ios`, `add android`) there is one platform command: `nap add maui`.

## Install

Install the CLI as a dev dependency in your project:

```bash
npm install @napacitor/cli --save-dev
```

Run any command with `npx nap <command>`.

## Commands

| Command | Description |
| --- | --- |
| [`init`](/cli/commands/init.md) | Initialize a new app, writing `napacitor.config.json` |
| [`add`](/cli/commands/add.md) | Generate the MAUI host project from the embedded template |
| [`assets`](/cli/commands/assets.md) | Apply icons / splash screens / theme colors to the host (MAUI Resizetizer) |
| [`copy`](/cli/commands/copy.md) | Copy the web build output into the host `wwwroot` |
| [`sync`](/cli/commands/sync.md) | `copy` + regenerate `napacitor.build.props` (wires plugin C# projects) |
| [`open`](/cli/commands/open.md) | Open the host project with the OS default handler |
| [`build`](/cli/commands/build.md) | Build the host project (`dotnet build`) |
| [`clean`](/cli/commands/clean.md) | Clean host build artifacts (`dotnet clean`) |
| [`run`](/cli/commands/run.md) | Build and run the app on a target device (`dotnet build -t:Run`) |
| [`list`](/cli/commands/list.md) | List installed `@napacitor/*` packages |
| [`help`](/cli/commands/help.md) | Print usage help |

All commands accept an optional platform argument (`maui`) which can be omitted — Napacitor currently has a single native platform target.

## Common options

- `--target <windows|android|ios|maccatalyst>` — target platform for `build` / `clean` / `run`. Defaults to `windows` on Windows and `android` elsewhere.
- `-c <Debug|Release>` — build configuration for `build` / `clean` / `run`. Defaults to `Debug`.

## Configuration

The CLI reads and writes [`napacitor.config.json`](/main/reference/config.md) in the app root. See [Configuring your app](/main/basics/configuring-your-app.md) for the available options.

Learn about the full workflow in the [Workflow guide](/main/basics/workflow.md).
