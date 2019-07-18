package(default_visibility = ["//:__subpackages__"])

load("@npm_bazel_typescript//:defs.bzl", "ts_library")
load("//:constants.bzl", "RELEASE_FILES")

ts_library(
    name = "src",
    srcs = RELEASE_FILES + [
        "debug.ts",
    ],
    tsickle_typed = True,
)

filegroup(
    name = "files",
    srcs = RELEASE_FILES,
)