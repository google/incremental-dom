package(default_visibility = ["//visibility:public"])

load("@npm_bazel_typescript//:defs.bzl", "ts_devserver", "ts_library")

ts_library(
    name = "app",
    srcs = ["index.ts"],
    deps = ["//src"],
)

load("@build_bazel_rules_nodejs//:defs.bzl", "rollup_bundle")

rollup_bundle(
  name = "bundle",
  entry_point = "index.js",
  deps = [":app"],
)