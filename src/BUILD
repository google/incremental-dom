package(default_visibility = ["//:__subpackages__"])

load("@npm_bazel_typescript//:defs.bzl", "ts_library")
load("//:constants.bzl", "RELEASE_FILES")

ts_library(
    name = "src",
    srcs = [
      ":all_files",
    ],
    tsickle_typed = True,
)

filegroup(
    name = "release_files",
    srcs = RELEASE_FILES,
)

filegroup(
    name = "all_files",
    srcs = [
        ":release_files",
        "debug.ts",
    ],
)