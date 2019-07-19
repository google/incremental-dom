package(default_visibility = ["//:__subpackages__"])

load("//:constants.bzl", "RELEASE_FILES")
load("@npm_bazel_typescript//:defs.bzl", "ts_library")

genrule(
    name = "release_files",
    srcs = ["//src:release_files"],
    outs = RELEASE_FILES,
    cmd = (
        "cp $(SRCS) $(@D)"
    ),
)

ts_library(
    name = "release",
    srcs = [
        ":release_files",
        "debug.ts",
    ],
    tsickle_typed = True,
)