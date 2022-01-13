package(default_visibility = ["//:__subpackages__"])

load("//:constants.bzl", "RELEASE_FILES")
load("@npm//@bazel/typescript:index.bzl", "ts_library")

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
        "debug.ts",
        ":release_files",
    ],
    tsickle_typed = True,
)
