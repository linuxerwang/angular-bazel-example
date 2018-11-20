package(default_visibility = ["//visibility:public"])

load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", "nodejs_binary")

ts_library(
  name = "injector_ts",
  srcs = ["injector.ts"],
  deps = [
    "@npm//@types/node",
    "@npm//@types/parse5",
  ],
  tsconfig = "tsconfig.json",
)

ts_library(
  name = "assembler_ts",
  srcs = ["assembler.ts"],
  deps = [
    "@npm//@types/node"

  ],
  tsconfig = "tsconfig.json",
)

filegroup(
  name = "node_modules_none",
)

nodejs_binary(
    name = "assembler",
    entry_point = "angular_bazel_example/tools/assembler.js",
    data = [":assembler_ts"],
    node_modules = ":node_modules_none",
)

nodejs_binary(
    name = "injector",
    entry_point = "angular_bazel_example/tools/injector.js",
    data = [":injector_ts", "@npm//parse5"],
)