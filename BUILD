package(default_visibility = ["//:__subpackages__"])

load("@npm_bazel_typescript//:defs.bzl", "ts_devserver", "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", "npm_package")

ts_library(
    name = "app",
    srcs = ["index.ts"],
    deps = ["//src"],
)

load("@build_bazel_rules_nodejs//:defs.bzl", "rollup_bundle")

rollup_bundle(
  name = "incremental-dom",
  entry_point = ":index.ts",
  deps = [":app"],
  global_name = "IncrementalDOM",
)

npm_package(
    name = "npm-ts",
    srcs = ["index.ts", "//src:files"],
)

npm_package(
    name = "npm-cjs",
    deps = [
       ":incremental-dom.cjs.js",
   ],
   replacements = {
      "DEBUG" : "process.env.NODE_ENV != \"production\""
   }
)

npm_package(
    name = "npm-umd",
    deps = [
       ":incremental-dom.umd.js",
   ],
   replacements = {
    "DEBUG" : "false"
   }
)

npm_package(
  name = "npm",
  packages = [
    ":npm-ts",
    ":npm-umd",
    ":npm-cjs",
  ]
)